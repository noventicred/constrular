-- Fix the ambiguous column reference in get_user_complete_profile function
CREATE OR REPLACE FUNCTION public.get_user_complete_profile(target_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(id uuid, email text, full_name text, phone text, street text, number text, complement text, city text, state text, zip_code text, address text, is_admin boolean, document_number text, birth_date date, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.phone,
    p.street,
    p.number,
    p.complement,
    p.city,
    p.state,
    p.zip_code,
    p.address,
    p.is_admin,
    s.document_number,
    s.birth_date,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN get_user_sensitive_data_secure(target_user_id, 'Complete profile access') s ON p.id = s.user_id
  WHERE p.id = target_user_id 
    AND (auth.uid() = target_user_id OR (
      SELECT is_admin FROM public.profiles WHERE id = auth.uid()
    ) = true);
END;
$function$