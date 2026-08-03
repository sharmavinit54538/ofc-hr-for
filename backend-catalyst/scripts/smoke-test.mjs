#!/usr/bin/env node
/**
 * Production smoke test.
 *
 * 1. Discovers every route from src/routes (via createFileRoute ids).
 * 2. Loads each route over HTTP against a running build and asserts it renders (< 400).
 * 3. Discovers the FastAPI endpoints each route consumes (RTK Query hooks -> service urls)
 *    and probes them against the backend to confirm they are reachable.
 *
 * Usage:
 *   node scripts/smoke-test.mjs
 *
 * Env:
 *   SMOKE_BASE_URL     app URL to test          (default http://localhost:8080)
 *   SMOKE_API_URL      FastAPI base URL         (default $VITE_API_BASE_URL or http://127.0.0.1:8000)
 *   SMOKE_AUTH_TOKEN   bearer token for the API (optional; without it 401 counts as reachable)
 *   SMOKE_TIMEOUT_MS   per-request timeout      (default 15000)
 *   SMOKE_SKIP_API=1   only check page rendering
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const ROUTES_DIR = join(ROOT, "src/routes");
const SERVICES_DIR = join(ROOT, "src/services");

const APP_URL = (process.env.SMOKE_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");
const API_URL = (
  process.env.SMOKE_API_URL ||
  readEnvFile("VITE_API_BASE_URL") ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 15000);
const SKIP_API = process.env.SMOKE_SKIP_API === "1";
const TOKEN = process.env.SMOKE_AUTH_TOKEN || "";

function readEnvFile(key) {
  const p = join(ROOT, ".env");
  if (!existsSync(p)) return "";
  const line = readFileSync(p, "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith(`${key}=`));
  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(full)) out.push(full);
  }
  return out;
}

/* ------------------------------------------------------------------ routes */

/** @returns {{ path: string, file: string }[]} */
function discoverRoutes() {
  const routes = [];
  for (const file of walk(ROUTES_DIR)) {
    const src = readFileSync(file, "utf8");
    const match = src.match(/createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/);
    if (!match) continue;
    const id = match[1];
    if (id.startsWith("/api/")) continue; // server routes, not pages
    // Strip pathless layout segments (/_authenticated) and trailing "/".
    let path = id
      .split("/")
      .filter((seg) => seg && !seg.startsWith("_"))
      .join("/");
    path = "/" + path;
    if (path.length > 1) path = path.replace(/\/+$/, "");
    if (path.includes("$")) continue; // dynamic routes need params; skipped
    if (!routes.some((r) => r.path === path)) {
      routes.push({ path, file: relative(ROOT, file) });
    }
  }
  return routes.sort((a, b) => a.path.localeCompare(b.path));
}

/* ---------------------------------------------------------------- services */

/** Map RTK Query hook name -> { url, method } */
function discoverEndpoints() {
  const map = new Map();
  if (!existsSync(SERVICES_DIR)) return map;
  for (const file of walk(SERVICES_DIR)) {
    const src = readFileSync(file, "utf8");
    const re = /(\w+)\s*:\s*builder\.(query|mutation)<([\s\S]*?)\}\),\n/g;
    let m;
    while ((m = re.exec(src))) {
      const [, name, kind, body] = m;
      const urlMatch =
        body.match(/url:\s*[`"']([^`"']+)/) || body.match(/=>\s*[`"']([^`"']+)/);
      if (!urlMatch) continue;
      const methodMatch = body.match(/method:\s*["'](\w+)["']/);
      const hook = `use${name[0].toUpperCase()}${name.slice(1)}${
        kind === "query" ? "Query" : "Mutation"
      }`;
      map.set(hook, {
        url: urlMatch[1].replace(/\$\{[^}]*\}/g, "__id__"),
        method: methodMatch ? methodMatch[1] : "GET",
        kind,
      });
    }
  }
  return map;
}

function endpointsForRoute(file, endpointMap) {
  const src = readFileSync(join(ROOT, file), "utf8");
  const used = [];
  for (const [hook, info] of endpointMap) {
    if (new RegExp(`\\b${hook}\\b`).test(src)) used.push({ hook, ...info });
  }
  return used;
}

/* ----------------------------------------------------------------- probing */

async function request(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal, redirect: "manual" });
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(timer);
  }
}

function pageVerdict(res) {
  if (!res.ok) return { pass: false, detail: `unreachable (${res.error})` };
  if (res.status >= 400) return { pass: false, detail: `HTTP ${res.status}` };
  return { pass: true, detail: `HTTP ${res.status}` };
}

function apiVerdict(res) {
  if (!res.ok) return { pass: false, detail: `unreachable (${res.error})` };
  // Reachable: the endpoint exists and the API answered. Auth/validation
  // responses still prove connectivity and routing.
  if ([401, 403, 405, 422].includes(res.status))
    return { pass: true, detail: `HTTP ${res.status} (reachable)` };
  if (res.status === 404) return { pass: false, detail: "HTTP 404 (endpoint missing)" };
  if (res.status >= 500) return { pass: false, detail: `HTTP ${res.status}` };
  return { pass: true, detail: `HTTP ${res.status}` };
}

async function main() {
  const routes = discoverRoutes();
  const endpointMap = discoverEndpoints();

  console.log(`Smoke test`);
  console.log(`  app : ${APP_URL}`);
  console.log(`  api : ${SKIP_API ? "(skipped)" : API_URL}`);
  console.log(`  routes discovered: ${routes.length}`);
  console.log(`  api endpoints discovered: ${endpointMap.size}\n`);

  const failures = [];
  const probedApi = new Map(); // url+method -> verdict (cache, endpoints are shared)

  for (const route of routes) {
    const res = await request(`${APP_URL}${route.path}`, {
      headers: { accept: "text/html" },
    });
    const verdict = pageVerdict(res);
    if (!verdict.pass) failures.push(`page ${route.path}: ${verdict.detail}`);
    console.log(`${verdict.pass ? "PASS" : "FAIL"}  ${route.path}  ${verdict.detail}`);

    if (SKIP_API) continue;
    const endpoints = endpointsForRoute(route.file, endpointMap);
    for (const ep of endpoints) {
      // Only probe read endpoints; mutations would write to production data.
      if (ep.method !== "GET") {
        console.log(`      skip  ${ep.method} ${ep.url} (mutation)`);
        continue;
      }
      const key = `${ep.method} ${ep.url}`;
      let epVerdict = probedApi.get(key);
      if (!epVerdict) {
        const apiRes = await request(`${API_URL}${ep.url.replace("__id__", "smoke-test")}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
          },
        });
        epVerdict = apiVerdict(apiRes);
        probedApi.set(key, epVerdict);
      }
      if (!epVerdict.pass) failures.push(`api ${key} (used by ${route.path}): ${epVerdict.detail}`);
      console.log(`      ${epVerdict.pass ? "ok  " : "FAIL"}  ${key}  ${epVerdict.detail}`);
    }
  }

  console.log(`\n${routes.length} routes checked, ${probedApi.size} API endpoints probed.`);
  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
