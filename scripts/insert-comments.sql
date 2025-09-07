-- ============================================================================
-- INSERIR COMENTÁRIOS POSITIVOS DIRETAMENTE
-- ============================================================================
-- Execute este SQL no Dashboard do Supabase (SQL Editor)

-- Inserir comentários positivos para os produtos existentes
-- Substitua os product_id pelos IDs reais dos seus produtos

-- Exemplo de como adicionar comentários para um produto específico:
-- 1. Primeiro, veja seus produtos:
-- SELECT id, name FROM products WHERE in_stock = true LIMIT 10;

-- 2. Depois, use os IDs reais nos INSERTs abaixo:

-- Comentários para o primeiro produto (SUBSTITUA O UUID)
INSERT INTO public.product_comments (product_id, author_name, comment_text, rating, likes, dislikes, created_at) VALUES
-- SUBSTITUA 'SEU-PRODUCT-ID-AQUI' pelo ID real do produto
('SEU-PRODUCT-ID-AQUI', 'Maria Silva', 'Excelente produto! Qualidade superior, entrega rápida e preço justo. Já comprei várias vezes e sempre fico satisfeita. Recomendo!', 5, 12, 0, NOW() - INTERVAL '5 days'),
('SEU-PRODUCT-ID-AQUI', 'João Santos', 'Produto de ótima qualidade. Chegou no prazo e bem embalado. Atendeu perfeitamente às minhas expectativas. Voltarei a comprar.', 5, 8, 1, NOW() - INTERVAL '3 days'),
('SEU-PRODUCT-ID-AQUI', 'Ana Costa', 'Muito bom! A qualidade é excelente e o preço é competitivo. Entrega foi super rápida. Estou muito satisfeita com a compra.', 4, 15, 0, NOW() - INTERVAL '7 days'),
('SEU-PRODUCT-ID-AQUI', 'Carlos Oliveira', 'Produto conforme descrito. Boa qualidade e chegou certinho. O atendimento da loja também foi muito bom. Recomendo!', 4, 6, 0, NOW() - INTERVAL '2 days');

-- Comentários adicionais (copie e cole alterando o product_id)
-- ('OUTRO-PRODUCT-ID', 'Fernanda Lima', 'Adorei o produto! Qualidade excelente, embalagem caprichada e entrega super rápida. Já indiquei para várias amigas!', 5, 20, 0, NOW() - INTERVAL '4 days'),
-- ('OUTRO-PRODUCT-ID', 'Roberto Pereira', 'Muito satisfeito com a compra. Produto de qualidade, preço bom e entrega no prazo. Loja confiável, já comprei outras vezes.', 4, 9, 1, NOW() - INTERVAL '6 days'),
-- ('OUTRO-PRODUCT-ID', 'Juliana Rodrigues', 'Produto maravilhoso! Superou minhas expectativas. Qualidade top e entrega rapidíssima. Virei cliente fiel dessa loja!', 5, 18, 0, NOW() - INTERVAL '1 day'),
-- ('OUTRO-PRODUCT-ID', 'Paulo Mendes', 'Excelente custo-benefício! Produto chegou perfeito, bem embalado e no prazo. Atendimento nota 10. Super recomendo!', 4, 11, 0, NOW() - INTERVAL '8 days');

-- INSTRUÇÕES:
-- 1. Vá para o Dashboard do Supabase
-- 2. Acesse SQL Editor
-- 3. Execute: SELECT id, name FROM products WHERE in_stock = true LIMIT 10;
-- 4. Copie os IDs dos produtos
-- 5. Substitua 'SEU-PRODUCT-ID-AQUI' pelos IDs reais
-- 6. Execute este script

-- Verificar se os comentários foram inseridos:
-- SELECT p.name, pc.author_name, pc.rating, pc.comment_text 
-- FROM products p 
-- JOIN product_comments pc ON p.id = pc.product_id 
-- ORDER BY pc.created_at DESC;
