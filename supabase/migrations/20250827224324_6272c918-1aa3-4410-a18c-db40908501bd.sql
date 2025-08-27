-- Create a separate table for highly sensitive user data
CREATE TABLE public.user_sensitive_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  document_number TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the sensitive data table
ALTER TABLE public.user_sensitive_data ENABLE ROW LEVEL SECURITY;

-- Only users can access their own sensitive data - NO admin access
CREATE POLICY "Users can view their own sensitive data" 
ON public.user_sensitive_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sensitive data" 
ON public.user_sensitive_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sensitive data" 
ON public.user_sensitive_data 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Migrate existing sensitive data
INSERT INTO public.user_sensitive_data (user_id, document_number, birth_date)
SELECT id, document_number, birth_date 
FROM public.profiles 
WHERE document_number IS NOT NULL OR birth_date IS NOT NULL;

-- Remove sensitive columns from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS document_number;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS birth_date;

-- Create trigger for updating timestamps on sensitive data
CREATE TRIGGER update_user_sensitive_data_updated_at
BEFORE UPDATE ON public.user_sensitive_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function for users to get their complete profile (including sensitive data)
CREATE OR REPLACE FUNCTION public.get_user_complete_profile(target_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  address TEXT,
  is_admin BOOLEAN,
  document_number TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
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
  LEFT JOIN public.user_sensitive_data s ON p.id = s.user_id
  WHERE p.id = target_user_id 
    AND (auth.uid() = target_user_id OR auth.uid() IS NULL);
$$;