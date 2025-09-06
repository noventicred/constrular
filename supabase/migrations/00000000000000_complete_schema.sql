-- ============================================================================
-- NOVA CASA CONSTRUÇÃO - MIGRAÇÃO COMPLETA DO BANCO DE DADOS
-- ============================================================================
-- Este arquivo consolida todas as migrações em uma única migração completa
-- Criado para facilitar o setup inicial do banco de dados
-- ============================================================================

-- ============================================================================
-- EXTENSÕES
-- ============================================================================
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABELAS PRINCIPAIS
-- ============================================================================

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount INTEGER DEFAULT 0,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  in_stock BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_special_offer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  street TEXT,
  number TEXT,
  complement TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  birth_date DATE,
  document_number TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de comentários dos produtos
CREATE TABLE IF NOT EXISTS public.product_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para dados sensíveis dos usuários (LGPD)
CREATE TABLE IF NOT EXISTS public.user_sensitive_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_number TEXT,
  encrypted_document_number TEXT,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de auditoria para dados sensíveis
CREATE TABLE IF NOT EXISTS public.sensitive_data_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  accessed_by UUID NOT NULL,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'SELECT', 'INSERT', 'UPDATE'
  field_accessed TEXT, -- campo sensível acessado
  access_reason TEXT, -- motivo opcional do acesso
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- STORAGE (ARMAZENAMENTO DE IMAGENS)
-- ============================================================================

-- Criar bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sensitive_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensitive_data_audit ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Função para verificar se usuário é admin (sem recursão)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id LIMIT 1),
    false
  );
$$;

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Função para registrar acesso a dados sensíveis
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

-- Função para criptografar números de documentos
CREATE OR REPLACE FUNCTION public.encrypt_document_number(plain_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  encryption_key := encode(sha256((auth.uid()::text || 'doc_key_salt')::bytea), 'hex');
  RETURN pgp_sym_encrypt(plain_text, encryption_key);
END;
$$;

-- Função para descriptografar números de documentos com auditoria
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
  -- Verificar permissões de acesso
  IF auth.uid() != target_user_id AND NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied to sensitive data';
  END IF;
  
  -- Registrar tentativa de acesso
  PERFORM log_sensitive_data_access(
    target_user_id,
    'user_sensitive_data',
    'SELECT',
    'document_number',
    access_reason
  );
  
  -- Gerar chave de criptografia
  encryption_key := encode(sha256((target_user_id::text || 'doc_key_salt')::bytea), 'hex');
  
  -- Descriptografar valor
  decrypted_value := pgp_sym_decrypt(encrypted_text, encryption_key);
  
  RETURN decrypted_value;
EXCEPTION
  WHEN OTHERS THEN
    -- Registrar falha na descriptografia
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

-- Função para obter dados sensíveis com segurança
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
  -- Verificar permissões de acesso
  IF auth.uid() != target_user_id AND NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied to sensitive data';
  END IF;
  
  -- Registrar acesso à data de nascimento
  PERFORM log_sensitive_data_access(
    target_user_id,
    'user_sensitive_data',
    'SELECT',
    'birth_date',
    access_reason
  );
  
  -- Retornar dados com número de documento descriptografado se existir
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

-- Função para obter perfil completo do usuário
CREATE OR REPLACE FUNCTION public.get_user_complete_profile(target_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  id uuid, 
  email text, 
  full_name text, 
  phone text, 
  street text, 
  number text, 
  complement text, 
  city text, 
  state text, 
  zip_code text, 
  address text, 
  is_admin boolean, 
  document_number text, 
  birth_date date, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
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

-- Função trigger para criptografar dados sensíveis
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Criptografar número do documento se fornecido e não já criptografado
  IF NEW.document_number IS NOT NULL AND NEW.encrypted_document_number IS NULL THEN
    NEW.encrypted_document_number := encrypt_document_number(NEW.document_number);
    -- Limpar versão em texto puro para novos registros
    IF TG_OP = 'INSERT' THEN
      NEW.document_number := NULL;
    END IF;
  END IF;
  
  -- Registrar operação
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

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Triggers para atualizar timestamps automaticamente
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_comments_updated_at
  BEFORE UPDATE ON public.product_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_sensitive_data_updated_at
  BEFORE UPDATE ON public.user_sensitive_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para criar perfil quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para criptografia em dados sensíveis
CREATE TRIGGER encrypt_sensitive_data_before_write
  BEFORE INSERT OR UPDATE ON public.user_sensitive_data
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_sensitive_data_trigger();

-- ============================================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================================================

-- POLÍTICAS PARA CATEGORIAS
-- Todos podem ver, apenas admins podem modificar
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- POLÍTICAS PARA PRODUTOS
-- Todos podem ver, apenas admins podem modificar
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete products" 
ON public.products 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- POLÍTICAS PARA PERFIS
-- Usuários podem ver/editar próprio perfil, admins podem ver todos
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- POLÍTICAS PARA PEDIDOS
-- Usuários podem ver próprios pedidos, admins podem ver todos
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- POLÍTICAS PARA ITENS DOS PEDIDOS
-- Usuários podem ver itens de seus pedidos, admins podem ver todos
CREATE POLICY "Users can view items from their orders" 
ON public.order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
));

-- POLÍTICAS PARA COMENTÁRIOS
-- Todos podem ver, apenas admins podem modificar
CREATE POLICY "Comments are viewable by everyone" 
ON public.product_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert comments" 
ON public.product_comments 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update comments" 
ON public.product_comments 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete comments" 
ON public.product_comments 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- POLÍTICAS PARA DADOS SENSÍVEIS
-- Usuários podem ver próprios dados, admins podem ver todos
CREATE POLICY "Users can view their own sensitive data" 
ON public.user_sensitive_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sensitive data" 
ON public.user_sensitive_data 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own sensitive data" 
ON public.user_sensitive_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sensitive data" 
ON public.user_sensitive_data 
FOR UPDATE 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA AUDITORIA
-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Only admins can view audit logs" 
ON public.sensitive_data_audit 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" 
ON public.sensitive_data_audit 
FOR INSERT 
WITH CHECK (true);

-- POLÍTICAS PARA STORAGE
-- Imagens são públicas para visualização, apenas admins podem fazer upload
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' AND
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-images' AND
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-images' AND
  public.is_admin(auth.uid())
);

-- ============================================================================
-- DADOS INICIAIS
-- ============================================================================

-- Inserir categorias iniciais
INSERT INTO public.categories (name, description, image_url) VALUES
('Cimento & Argamassa', 'Materiais para fundação e estrutura', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop'),
('Tijolos & Blocos', 'Tijolos e blocos para construção', 'https://images.unsplash.com/photo-1592932525620-7b5c9c8ba8d1?w=300&h=300&fit=crop'),
('Tintas & Vernizes', 'Tintas e vernizes para acabamento', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop'),
('Ferramentas', 'Ferramentas para construção e reparo', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=300&fit=crop'),
('Hidráulica', 'Materiais para sistema hidráulico', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=300&fit=crop'),
('Elétrica', 'Materiais elétricos e cabos', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop')
ON CONFLICT (name) DO NOTHING;

-- Inserir produtos iniciais
INSERT INTO public.products (name, description, price, original_price, discount, image_url, category_id, rating, reviews, in_stock, is_featured, is_special_offer) VALUES
(
  'Cimento CP II-E-32 50kg',
  'Cimento Portland de alta qualidade, ideal para obras de pequeno e médio porte. Oferece excelente resistência e durabilidade.',
  32.90,
  39.90,
  18,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE name = 'Cimento & Argamassa' LIMIT 1),
  4.8,
  156,
  true,
  true,
  false
),
(
  'Tijolo 6 Furos 14x19x29cm',
  'Tijolo cerâmico de 6 furos, ideal para alvenaria estrutural e de vedação. Excelente isolamento térmico e acústico.',
  0.89,
  1.20,
  26,
  'https://images.unsplash.com/photo-1592932525620-7b5c9c8ba8d1?w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE name = 'Tijolos & Blocos' LIMIT 1),
  4.6,
  89,
  true,
  false,
  true
),
(
  'Tinta Acrílica Premium 18L',
  'Tinta acrílica de alta cobertura e durabilidade. Ideal para paredes internas e externas. Disponível em várias cores.',
  189.90,
  249.90,
  24,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE name = 'Tintas & Vernizes' LIMIT 1),
  4.9,
  234,
  true,
  true,
  true
),
(
  'Furadeira de Impacto 650W',
  'Furadeira de impacto profissional com motor de 650W. Ideal para furar concreto, madeira e metal com precisão.',
  299.90,
  399.90,
  25,
  'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE name = 'Ferramentas' LIMIT 1),
  4.7,
  67,
  false,
  true,
  true
),
(
  'Tubo PVC 100mm 6m',
  'Tubo PVC para sistema de esgoto e drenagem. Resistente e durável, ideal para instalações hidráulicas.',
  89.90,
  109.90,
  18,
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE name = 'Hidráulica' LIMIT 1),
  4.5,
  123,
  true,
  false,
  false
),
(
  'Fio Flexível 2,5mm 100m',
  'Cabo flexível de 2,5mm² para instalações elétricas residenciais e comerciais. Certificado pelo INMETRO.',
  159.90,
  189.90,
  16,
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop',
  (SELECT id FROM categories WHERE name = 'Elétrica' LIMIT 1),
  4.8,
  98,
  true,
  false,
  false
)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- FIM DA MIGRAÇÃO COMPLETA
-- ============================================================================

-- Comentário final
COMMENT ON SCHEMA public IS 'Schema principal do e-commerce Nova Casa Construção';
