import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SecurityAlert, DeviceSession, Invitation } from "./types";

// Validation Schemas
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["HR_ADMIN", "IT_ADMIN", "EXECUTIVE", "MANAGER", "EMPLOYEE"]),
  department: z.string(),
});

// Server Functions
export const getCurrentAuthUser = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [{ data: profile }, { data: userRole }, { data: company }] = await Promise.all([
      supabase
        .from("profiles")
        .select("*, departments(name), designations(name)")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("companies")
        .select("*")
        .eq("owner_id", userId)
        .maybeSingle(),
    ]);

    return {
      userId,
      email: context.claims?.email ?? "",
      profile,
      role: userRole?.role ?? profile?.role ?? "EMPLOYEE",
      company,
    };
  });

export const getSecurityAlertsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // In production, queries security_alerts table
    const alerts: SecurityAlert[] = [
      {
        id: "sec-01",
        title: "Unusual Login Location",
        description: "Login attempt detected from a new IP range.",
        severity: "medium",
        timestamp: new Date().toISOString(),
        resolved: false,
      },
    ];
    return alerts;
  });

export const getDeviceSessionsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sessions: DeviceSession[] = [
      {
        id: "ses_01",
        device: "MacBook Pro",
        os: "macOS",
        browser: "Chrome",
        location: "Bengaluru, India",
        ip: "103.21.244.18",
        lastActive: "Active now",
        current: true,
        trusted: true,
      },
    ];
    return sessions;
  });

export const getInvitationsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const invitations: Invitation[] = [];
    return invitations;
  });
