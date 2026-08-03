-- Explicitly revoke execute from anon/authenticated/public on security definer helpers
REVOKE ALL ON FUNCTION public.has_role(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Retain execute for service_role and the function owner only
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;