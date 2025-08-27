-- Inserir categorias de exemplo
INSERT INTO public.categories (name, description, image_url) VALUES
('Cimento & Argamassa', 'Materiais para fundação e estrutura', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop'),
('Tijolos & Blocos', 'Tijolos e blocos para construção', 'https://images.unsplash.com/photo-1592932525620-7b5c9c8ba8d1?w=300&h=300&fit=crop'),
('Tintas & Vernizes', 'Tintas e vernizes para acabamento', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop'),
('Ferramentas', 'Ferramentas para construção e reparo', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=300&fit=crop'),
('Hidráulica', 'Materiais para sistema hidráulico', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=300&fit=crop'),
('Elétrica', 'Materiais elétricos e cabos', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop');

-- Obter IDs das categorias para usar nos produtos
-- Inserir produtos de exemplo usando os IDs das categorias
INSERT INTO public.products (name, description, price, original_price, discount, image_url, category_id, rating, reviews, in_stock) VALUES
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
  true
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
  false
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
  true
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
  true
);