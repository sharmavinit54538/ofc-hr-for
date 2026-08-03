import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createTicketSchema = z.object({
  subject: z.string().min(2),
  category: z.string().min(1),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
});

export const getHelpdeskTicketsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) return [];

    const { data: tickets, error } = await supabase
      .from("helpdesk_tickets")
      .select("*, requester:employees!helpdesk_tickets_requester_id_fkey(full_name)")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return tickets || [];
  });

export const createTicketServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => createTicketSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: emp } = await supabase
      .from("employees")
      .select("id, organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!emp) throw new Error("Employee record missing");

    const code = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: ticket, error } = await supabase
      .from("helpdesk_tickets")
      .insert({
        organization_id: emp.organization_id,
        ticket_code: code,
        subject: data.subject,
        category: data.category,
        priority: data.priority || "Medium",
        requester_id: emp.id,
        status: "Open",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return ticket;
  });
