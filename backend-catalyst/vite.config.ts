// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      target: "esnext",
      cssCodeSplit: true,
      // Vite 8 no longer bundles esbuild; use its built-in oxc minifier.
      minify: "oxc",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("framer-motion")) return "vendor-motion";
              if (id.includes("lucide-react")) return "vendor-icons";
              if (id.includes("@tanstack")) return "vendor-tanstack";
              if (id.includes("@radix-ui") || id.includes("cmdk")) return "vendor-ui";
              if (id.includes("recharts")) return "vendor-charts";
              return "vendor-core";
            }
            return undefined;
          },
        },
      },
    },
  },
});
