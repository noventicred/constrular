-- Drop the current public access policy for settings
DROP POLICY "Settings are viewable by everyone" ON public.settings;

-- Create new policy to restrict settings access to authenticated users only
CREATE POLICY "Settings are viewable by authenticated users" 
ON public.settings 
FOR SELECT 
TO authenticated
USING (true);

-- Also add a policy for anon users to access only specific non-sensitive settings
-- This allows unauthenticated users to see basic store info like name and free shipping threshold
CREATE POLICY "Public settings are viewable by everyone" 
ON public.settings 
FOR SELECT 
TO anon
USING (
  key IN (
    'store_name',
    'free_shipping_threshold'
  )
);