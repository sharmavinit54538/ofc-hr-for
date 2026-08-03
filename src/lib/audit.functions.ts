import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const logAuditSchema = z.object({
  entityName: z.string().min(1),
  entityId: z.string().optional(),
  action: z.string().min(1),
  oldData: z.record(z.unknown()).optional(),
  newData: z.record(z.unknown()).optional(),
});

export const logAuditEventServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => logAuditSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: logEntry, error } = await supabase
      .from("audit_logs")
      .insert({
        organization_id: profile?.organization_id ?? null,
        actor_id: userId,
        entity_name: data.entityName,
        entity_id: data.entityId ?? null,
        action: data.action,
        old_data: data.oldData ? (data.oldData as any) : null,
        new_data: data.newData ? (data.newData as any) : null,
      })
      .select()
      .single();

    if (error) {
      console.error("[logAuditEventServerFn]", error);
      throw new Error(error.message);
    }

    return logEntry;
  });

export const getAuditLogsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) return [];

    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return logs || [];
  });
