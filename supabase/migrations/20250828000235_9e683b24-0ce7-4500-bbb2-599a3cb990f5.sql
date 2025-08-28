-- Fix the remaining ambiguity in get_user_complete_profile function
DROP FUNCTION IF EXISTS public.get_user_complete_profile(uuid);

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
    COALESCE(s.document_number, '') as document_number,
    s.birth_date,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN public.user_sensitive_data s ON p.id = s.user_id
  WHERE p.id = target_user_id 
    AND (auth.uid() = target_user_id OR p.is_admin = true);
END;
$function$