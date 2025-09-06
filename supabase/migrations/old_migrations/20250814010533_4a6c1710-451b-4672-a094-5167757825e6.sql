-- Adicionar colunas para ofertas especiais e produtos em destaque
ALTER TABLE public.products 
ADD COLUMN is_featured boolean DEFAULT false,
ADD COLUMN is_special_offer boolean DEFAULT false;

-- Atualizar alguns produtos existentes como exemplo
UPDATE public.products 
SET is_featured = true 
WHERE name IN ('Cimento CP II-E-32 50kg', 'Tinta Acrílica Premium 18L', 'Furadeira de Impacto 650W');

UPDATE public.products 
SET is_special_offer = true 
WHERE discount > 20;