import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Authenticating · OFC HR Workforce Platform" }],
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    console.log("[OAuth Callback] Initiating post-redirect authentication handler...");

    async function processAuthCallback() {
      try {
        // 1. First inspect current session from Supabase client
        console.log("[OAuth Callback] Calling supabase.auth.getSession()...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[OAuth Callback] getSession error:", sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("[OAuth Callback] Valid session detected for user:", session.user.email);
          toast.success("Signed in successfully", {
            description: `Welcome ${session.user.email || "back to OFC HR"}`,
          });
          if (isMounted) {
            navigate({ to: "/dashboard" });
          }
          return;
        }

        // 2. Check if authorization code is present in URL search params (PKCE flow)
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");

        if (code) {
          console.log("[OAuth Callback] PKCE code found in query parameters. Exchanging code for session...");
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error("[OAuth Callback] exchangeCodeForSession error:", exchangeError);
            throw exchangeError;
          }

          if (data?.session) {
            console.log("[OAuth Callback] Code exchanged successfully. User:", data.session.user.email);
            toast.success("Signed in successfully", {
              description: `Welcome ${data.session.user.email}`,
            });
            if (isMounted) {
              navigate({ to: "/dashboard" });
            }
            return;
          }
        }

        // 3. Listen for onAuthStateChange events (handles hash fragments #access_token=...)
        console.log("[OAuth Callback] Listening for auth state changes via onAuthStateChange...");
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log(`[OAuth Callback] Auth state change event [${event}]:`, currentSession?.user?.email);
          
          if (currentSession && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
            toast.success("Signed in successfully", {
              description: `Welcome ${currentSession.user.email || ""}`,
            });
            authListener.subscription.unsubscribe();
            if (isMounted) {
              navigate({ to: "/dashboard" });
            }
          }
        });

        // 4. Timeout safety check: fallback if no session acquired after 6s
        setTimeout(async () => {
          const { data: { session: fallbackSession } } = await supabase.auth.getSession();
          if (fallbackSession && isMounted) {
            console.log("[OAuth Callback] Fallback check found valid session:", fallbackSession.user.email);
            navigate({ to: "/dashboard" });
          } else if (isMounted && !errorMsg) {
            console.warn("[OAuth Callback] Session retrieval timed out.");
            setErrorMsg("Authentication session could not be retrieved. Please try signing in again.");
          }
        }, 6000);

      } catch (err: any) {
        console.error("[OAuth Callback] Exception in processAuthCallback:", err);
        if (isMounted) {
          const message = err?.message || "An unexpected error occurred during Google authentication.";
          setErrorMsg(message);
          toast.error("Authentication Failed", { description: message });
        }
      }
    }

    processAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <div className="p-6 bg-card border border-destructive/30 rounded-2xl max-w-md w-full shadow-lg text-center space-y-4">
          <h2 className="text-lg font-bold text-destructive">Authentication Error</h2>
          <p className="text-xs text-muted-foreground">{errorMsg}</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/auth/login" })}
            className="w-full py-2.5 px-4 text-xs font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all"
          >
            Return to Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h2 className="text-base font-semibold text-foreground">Completing Sign in...</h2>
        <p className="text-xs text-muted-foreground">Verifying Google authentication with Supabase...</p>
      </div>
    </div>
  );
}
