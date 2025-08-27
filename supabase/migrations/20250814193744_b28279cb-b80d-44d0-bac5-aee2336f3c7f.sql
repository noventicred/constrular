-- Create settings table for system configurations
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings
CREATE POLICY "Settings are viewable by everyone" 
ON public.settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert settings" 
ON public.settings 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Only admins can update settings" 
ON public.settings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Only admins can delete settings" 
ON public.settings 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default WhatsApp configuration
INSERT INTO public.settings (key, value, description) VALUES 
('whatsapp_number', '5511999999999', 'Número do WhatsApp para receber pedidos (formato: 55DDNNNNNNNNN)'),
('store_name', 'Minha Loja', 'Nome da loja'),
('store_email', 'contato@minhaloja.com', 'Email de contato da loja'),
('free_shipping_threshold', '199', 'Valor mínimo para frete grátis'),
('default_shipping_cost', '29.90', 'Custo padrão do frete');