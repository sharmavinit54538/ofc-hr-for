-- Revoke direct execution of security definer helpers from public/authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, authenticated;

-- Only service_role and postgres should retain access
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;