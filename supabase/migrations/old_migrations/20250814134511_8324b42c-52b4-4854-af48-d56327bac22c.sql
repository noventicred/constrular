-- Atualizar a função handle_new_user para garantir que todos sejam clientes por padrão
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, street, number, complement, city, state, zip_code, is_admin)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'street',
    new.raw_user_meta_data ->> 'number',
    new.raw_user_meta_data ->> 'complement',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'state',
    new.raw_user_meta_data ->> 'zip_code',
    false  -- Sempre criar como cliente (não admin)
  );
  RETURN new;
END;
$$;