-- Create audit log table for tracking access to sensitive data
CREATE TABLE public.sensitive_data_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  accessed_by UUID NOT NULL,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'SELECT', 'INSERT', 'UPDATE'
  field_accessed TEXT, -- which sensitive field was accessed
  access_reason TEXT, -- optional reason for access
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.sensitive_data_audit ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.sensitive_data_audit 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Allow system to insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.sensitive_data_audit 
FOR INSERT 
WITH CHECK (true);

-- Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
  target_user_id UUID,
  table_name TEXT,
  operation TEXT,
  field_accessed TEXT DEFAULT NULL,
  access_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.sensitive_data_audit (
    user_id,
    accessed_by,
    table_name,
    operation,
    field_accessed,
    access_reason,
    ip_address,
    user_agent
  ) VALUES (
    target_user_id,
    auth.uid(),
    table_name,
    operation,
    field_accessed,
    access_reason,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$;

-- Add encrypted document number column
ALTER TABLE public.user_sensitive_data 
ADD COLUMN encrypted_document_number TEXT;

-- Create function to encrypt document numbers
CREATE OR REPLACE FUNCTION public.encrypt_document_number(plain_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Use a consistent key derived from the user's ID for document encryption
  -- In production, you'd want to use a proper key management system
  encryption_key := encode(sha256((auth.uid()::text || 'doc_key_salt')::bytea), 'hex');
  
  -- Use PGP encryption with the derived key
  RETURN pgp_sym_encrypt(plain_text, encryption_key);
END;
$$;

-- Create function to decrypt document numbers with audit logging
CREATE OR REPLACE FUNCTION public.decrypt_document_number(
  encrypted_text TEXT, 
  target_user_id UUID,
  access_reason TEXT DEFAULT 'User profile access'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  encryption_key TEXT;
  decrypted_value TEXT;
BEGIN
  -- Verify access permissions
  IF auth.uid() != target_user_id AND NOT (
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied to sensitive data';
  END IF;
  
  -- Log the access attempt
  PERFORM log_sensitive_data_access(
    target_user_id,
    'user_sensitive_data',
    'SELECT',
    'document_number',
    access_reason
  );
  
  -- Generate encryption key
  encryption_key := encode(sha256((target_user_id::text || 'doc_key_salt')::bytea), 'hex');
  
  -- Decrypt the value
  decrypted_value := pgp_sym_decrypt(encrypted_text, encryption_key);
  
  RETURN decrypted_value;
EXCEPTION
  WHEN OTHERS THEN
    -- Log failed decryption attempt
    PERFORM log_sensitive_data_access(
      target_user_id,
      'user_sensitive_data',
      'SELECT_FAILED',
      'document_number',
      'Decryption failed: ' || SQLERRM
    );
    RAISE;
END;
$$;

-- Create secure function to get user sensitive data with audit logging
CREATE OR REPLACE FUNCTION public.get_user_sensitive_data_secure(
  target_user_id UUID DEFAULT auth.uid(),
  access_reason TEXT DEFAULT 'Profile access'
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  document_number TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Verify access permissions
  IF auth.uid() != target_user_id AND NOT (
    SELECT is_admin FROM profiles WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied to sensitive data';
  END IF;
  
  -- Log access to birth date
  PERFORM log_sensitive_data_access(
    target_user_id,
    'user_sensitive_data',
    'SELECT',
    'birth_date',
    access_reason
  );
  
  -- Return data with decrypted document number if it exists
  RETURN QUERY
  SELECT 
    usd.id,
    usd.user_id,
    CASE 
      WHEN usd.encrypted_document_number IS NOT NULL THEN
        decrypt_document_number(usd.encrypted_document_number, target_user_id, access_reason)
      ELSE 
        usd.document_number
    END as document_number,
    usd.birth_date,
    usd.created_at,
    usd.updated_at
  FROM public.user_sensitive_data usd
  WHERE usd.user_id = target_user_id;
END;
$$;

-- Create trigger to encrypt document numbers on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Encrypt document number if provided and not already encrypted
  IF NEW.document_number IS NOT NULL AND NEW.encrypted_document_number IS NULL THEN
    NEW.encrypted_document_number := encrypt_document_number(NEW.document_number);
    -- Clear the plain text version for new records
    IF TG_OP = 'INSERT' THEN
      NEW.document_number := NULL;
    END IF;
  END IF;
  
  -- Log the operation
  PERFORM log_sensitive_data_access(
    NEW.user_id,
    'user_sensitive_data',
    TG_OP,
    CASE 
      WHEN NEW.document_number IS NOT NULL OR NEW.encrypted_document_number IS NOT NULL 
      THEN 'document_number'
      ELSE NULL
    END,
    'Data modification'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for encryption on insert/update
CREATE TRIGGER encrypt_sensitive_data_before_write
  BEFORE INSERT OR UPDATE ON public.user_sensitive_data
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_sensitive_data_trigger();

-- Update the get_user_complete_profile function to use secure access
CREATE OR REPLACE FUNCTION public.get_user_complete_profile(target_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(id uuid, email text, full_name text, phone text, street text, number text, complement text, city text, state text, zip_code text, address text, is_admin boolean, document_number text, birth_date date, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
    AND (auth.uid() = target_user_id OR auth.uid() IS NULL);
END;
$$;