import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17Z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7A21.99 21.99 0 0 0 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.2 13.2 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7Z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07Z"
      />
    </svg>
  );
}

function ChatGPTLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" focusable="false">
      <path
        fill="#10A37F"
        d="M22.28 9.82a5.99 5.99 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.06 6.06 0 0 0 10.8 0a6.06 6.06 0 0 0-5.78 4.2 5.99 5.99 0 0 0-4 2.9 6.06 6.06 0 0 0 .75 7.1 5.99 5.99 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A6.06 6.06 0 0 0 13.2 24a6.06 6.06 0 0 0 5.78-4.2 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.7-7.08ZM13.2 22.4a4.5 4.5 0 0 1-2.9-1.05l.14-.08 4.82-2.78a.79.79 0 0 0 .4-.69v-6.79l2.04 1.18a.07.07 0 0 1 .04.06v5.63a4.53 4.53 0 0 1-4.54 4.52ZM3.7 18.35a4.5 4.5 0 0 1-.54-3.03l.14.09 4.82 2.78a.78.78 0 0 0 .79 0l5.88-3.4v2.35a.08.08 0 0 1-.03.07l-4.88 2.81a4.53 4.53 0 0 1-6.18-1.67ZM2.44 7.9a4.5 4.5 0 0 1 2.36-1.98v5.73a.78.78 0 0 0 .39.68l5.88 3.39-2.04 1.18a.07.07 0 0 1-.07 0L3.68 14.1A4.53 4.53 0 0 1 2.44 7.9Zm16.72 3.88-5.88-3.4 2.04-1.17a.07.07 0 0 1 .07 0l4.88 2.81a4.52 4.52 0 0 1-.68 8.16v-5.72a.79.79 0 0 0-.4-.68Zm2.03-3.05-.14-.09-4.82-2.78a.79.79 0 0 0-.79 0l-5.88 3.4V6.9a.07.07 0 0 1 .03-.07l4.88-2.8a4.52 4.52 0 0 1 6.72 4.7ZM8.55 12.85l-2.04-1.18a.07.07 0 0 1-.04-.06V6a4.52 4.52 0 0 1 7.42-3.48l-.14.08-4.82 2.78a.79.79 0 0 0-.4.69l.02 6.78Zm1.11-2.38 2.62-1.51 2.62 1.51v3.02l-2.62 1.51-2.62-1.51v-3.02Z"
      />
    </svg>
  );
}

function OktaLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true" focusable="false">
      <path
        fill="#007DC1"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
      />
    </svg>
  );
}

const providers = [
  { id: "google", name: "Google", Logo: GoogleLogo },
  { id: "chatgpt", name: "ChatGPT", Logo: ChatGPTLogo },
  { id: "okta", name: "Okta SSO", Logo: OktaLogo },
];

export function SocialLoginButtons({ className }: { className?: string }) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialSignIn = async (providerId: string) => {
    try {
      setLoadingProvider(providerId);
      console.log(`[OAuth] Initiating ${providerId} login flow...`);

      const apiBase = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) || "http://localhost:8000";
      const redirectTarget = `${window.location.origin}/auth/callback`;

      const requestUrl = `${apiBase}/api/v1/sso/${providerId}/login?redirect_to=${encodeURIComponent(redirectTarget)}`;
      console.log(`[OAuth] Fetching authorization_url from:`, requestUrl);

      const res = await fetch(requestUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`SSO initialization endpoint returned HTTP ${res.status}`);
      }

      const response = await res.json();
      console.log(`[OAuth] Backend response received:`, response);

      const authUrl = response?.data?.authorization_url;
      if (!authUrl) {
        throw new Error("Authorization URL missing from backend response");
      }

      console.log(`[OAuth] Redirecting browser to authorization_url:`, authUrl);
      window.location.href = authUrl;
    } catch (err: any) {
      console.error(`[OAuth] ${providerId} login initiation failed:`, err);
      toast.error(`Sign in with ${providerId} failed`, {
        description: err?.message || "Could not initiate social login request.",
      });
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn("grid grid-cols-3 gap-2.5", className)}>
      {providers.map(({ id, name, Logo }) => {
        const isLoading = loadingProvider === id;
        return (
          <button
            key={id}
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleSocialSignIn(id)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/60 px-3 text-xs font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-accent hover:text-foreground active:scale-[0.98] disabled:opacity-50 dark:bg-card/40"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Logo />
            )}
            <span className="truncate">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
