import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAppDispatch } from "@/app/hooks";
import { setAccessToken } from "@/features/auth/authSlice";
import { getLandingRoute } from "@/lib/auth/roles";
import { useAuthStore } from "@/store/useAuthStore";
import type { Role } from "@/lib/auth/types";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Authenticating · OFC HR Workforce Platform" }],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [statusText, setStatusText] = useState("Verifying Google authentication with Supabase...");
  const processedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function handleExchange(supabaseAccessToken: string) {
      if (processedRef.current) return;
      processedRef.current = true;

      try {
        if (isMounted) setStatusText("Exchanging session with backend...");
        const apiBase = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) || "http://localhost:8000";

        const res = await fetch(`${apiBase}/api/v1/sso/google/exchange`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ access_token: supabaseAccessToken }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.detail || errData?.message || `HTTP ${res.status}`);
        }

        const json = await res.json();
        const tokenData = json?.data;
        const accessToken = tokenData?.access_token;
        const refreshToken = tokenData?.refresh_token;
        const role = (tokenData?.role as Role) || "HR_ADMIN";

        if (!accessToken) {
          throw new Error("Backend did not return an access token");
        }

        // Store access token in Redux and Zustand
        dispatch(setAccessToken(accessToken));
        useAuthStore.getState().setAccessToken(accessToken);

        // Store refresh token in localStorage if present
        if (refreshToken && typeof window !== "undefined") {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Fetch user profile into Zustand store
        await useAuthStore.getState().fetchMe();

        // Redirect to role-appropriate dashboard route
        const destination = getLandingRoute(role);
        if (isMounted) {
          navigate({ to: destination as any });
        }
      } catch (err) {
        console.error("[OAuth Callback] Backend exchange failed:", err);
        if (isMounted) {
          navigate({ to: "/auth/login", search: { error: "sso_failed" } as any });
        }
      }
    }

    async function initAuthFlow() {
      try {
        // 1. Check existing session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.access_token) {
          await handleExchange(session.access_token);
          return;
        }

        // 2. Check for PKCE authorization code in URL query params
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        const hasHash = window.location.hash.includes("access_token");

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          if (data?.session?.access_token) {
            await handleExchange(data.session.access_token);
            return;
          }
        }

        // 3. Listen for onAuthStateChange events (SIGNED_IN / INITIAL_SESSION)
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (currentSession?.access_token && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
            authListener.subscription.unsubscribe();
            await handleExchange(currentSession.access_token);
          }
        });

        // 4. Edge case check: direct landing without code/hash/session
        if (!code && !hasHash) {
          setTimeout(async () => {
            const { data: { session: checkSession } } = await supabase.auth.getSession();
            if (checkSession?.access_token) {
              await handleExchange(checkSession.access_token);
            } else if (isMounted && !processedRef.current) {
              navigate({ to: "/auth/login" });
            }
          }, 1500);
        } else {
          // Timeout fallback
          setTimeout(async () => {
            const { data: { session: checkSession } } = await supabase.auth.getSession();
            if (checkSession?.access_token) {
              await handleExchange(checkSession.access_token);
            } else if (isMounted && !processedRef.current) {
              navigate({ to: "/auth/login", search: { error: "sso_failed" } as any });
            }
          }, 6000);
        }

      } catch (err) {
        console.error("[OAuth Callback] Auth initialization error:", err);
        if (isMounted && !processedRef.current) {
          navigate({ to: "/auth/login", search: { error: "sso_failed" } as any });
        }
      }
    }

    initAuthFlow();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h2 className="text-base font-semibold text-foreground">Completing Sign in...</h2>
        <p className="text-xs text-muted-foreground">{statusText}</p>
      </div>
    </div>
  );
}
