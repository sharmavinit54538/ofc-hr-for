import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const uploadDocumentSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  fileUrl: z.string().optional(),
  securityClassification: z.string().optional(),
});

export const getDocumentsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) return [];

    const { data: docs, error } = await supabase
      .from("documents")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return docs || [];
  });

export const uploadDocumentServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => uploadDocumentSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) throw new Error("Organization missing");

    const code = `DOC-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: doc, error } = await supabase
      .from("documents")
      .insert({
        organization_id: profile.organization_id,
        document_code: code,
        title: data.title,
        category: data.category,
        file_url: data.fileUrl || "#",
        uploaded_by: profile.full_name || "Admin",
        security_classification: data.securityClassification || "Confidential",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return doc;
  });
