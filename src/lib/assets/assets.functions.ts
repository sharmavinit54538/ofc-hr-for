import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createAssetSchema = z.object({
  assetTag: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  serialNumber: z.string().optional(),
  value: z.number().optional(),
});

export const getAssetsServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) return [];

    const { data: assets, error } = await supabase
      .from("assets")
      .select("*, assigned_employee:employees!assets_assigned_to_fkey(full_name)")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return assets || [];
  });

export const createAssetServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => createAssetSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.organization_id) throw new Error("Organization missing");

    const { data: asset, error } = await supabase
      .from("assets")
      .insert({
        organization_id: profile.organization_id,
        asset_tag: data.assetTag,
        name: data.name,
        category: data.category,
        serial_number: data.serialNumber ?? null,
        value: data.value ?? null,
        status: "Available",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return asset;
  });
