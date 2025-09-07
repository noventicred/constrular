-- ============================================================================
-- ADICIONAR COMENTÁRIOS POSITIVOS PARA PRODUTOS
-- ============================================================================
-- Adiciona comentários realistas com avaliações 4 e 5 estrelas

-- Primeiro, vamos buscar alguns produtos existentes e adicionar comentários
-- Comentários para Cimento (assumindo que existe)
DO $$
DECLARE
    product_record RECORD;
    comment_data RECORD;
    comments_to_insert JSONB := '[
        {
            "author_name": "Maria Silva",
            "comment_text": "Excelente produto! Qualidade superior, entrega rápida e preço justo. Já comprei várias vezes e sempre fico satisfeita. Recomendo!",
            "rating": 5,
            "likes": 12,
            "dislikes": 0
        },
        {
            "author_name": "João Santos",
            "comment_text": "Produto de ótima qualidade. Chegou no prazo e bem embalado. Atendeu perfeitamente às minhas expectativas. Voltarei a comprar.",
            "rating": 5,
            "likes": 8,
            "dislikes": 1
        },
        {
            "author_name": "Ana Costa",
            "comment_text": "Muito bom! A qualidade é excelente e o preço é competitivo. Entrega foi super rápida. Estou muito satisfeita com a compra.",
            "rating": 4,
            "likes": 15,
            "dislikes": 0
        },
        {
            "author_name": "Carlos Oliveira",
            "comment_text": "Produto conforme descrito. Boa qualidade e chegou certinho. O atendimento da loja também foi muito bom. Recomendo!",
            "rating": 4,
            "likes": 6,
            "dislikes": 0
        },
        {
            "author_name": "Fernanda Lima",
            "comment_text": "Adorei o produto! Qualidade excelente, embalagem caprichada e entrega super rápida. Já indiquei para várias amigas!",
            "rating": 5,
            "likes": 20,
            "dislikes": 0
        },
        {
            "author_name": "Roberto Pereira",
            "comment_text": "Muito satisfeito com a compra. Produto de qualidade, preço bom e entrega no prazo. Loja confiável, já comprei outras vezes.",
            "rating": 4,
            "likes": 9,
            "dislikes": 1
        },
        {
            "author_name": "Juliana Rodrigues",
            "comment_text": "Produto maravilhoso! Superou minhas expectativas. Qualidade top e entrega rapidíssima. Virei cliente fiel dessa loja!",
            "rating": 5,
            "likes": 18,
            "dislikes": 0
        },
        {
            "author_name": "Paulo Mendes",
            "comment_text": "Excelente custo-benefício! Produto chegou perfeito, bem embalado e no prazo. Atendimento nota 10. Super recomendo!",
            "rating": 4,
            "likes": 11,
            "dislikes": 0
        },
        {
            "author_name": "Carla Ferreira",
            "comment_text": "Produto de primeira qualidade! Entrega foi super rápida e o produto veio exatamente como esperado. Muito satisfeita!",
            "rating": 5,
            "likes": 14,
            "dislikes": 0
        },
        {
            "author_name": "Ricardo Alves",
            "comment_text": "Ótima compra! Produto de qualidade, preço justo e entrega rápida. Loja séria e confiável. Já fiz várias compras aqui.",
            "rating": 4,
            "likes": 7,
            "dislikes": 0
        }
    ]'::JSONB;
    comment_item JSONB;
BEGIN
    -- Para cada produto existente, adicionar alguns comentários aleatórios
    FOR product_record IN 
        SELECT id, name FROM public.products 
        WHERE in_stock = true 
        ORDER BY created_at DESC 
        LIMIT 10
    LOOP
        -- Adicionar 3-5 comentários aleatórios para cada produto
        FOR i IN 1..3 + (RANDOM() * 2)::INTEGER LOOP
            -- Selecionar um comentário aleatório
            comment_item := comments_to_insert->((RANDOM() * (jsonb_array_length(comments_to_insert) - 1))::INTEGER);
            
            -- Inserir o comentário
            INSERT INTO public.product_comments (
                product_id,
                author_name,
                comment_text,
                rating,
                likes,
                dislikes,
                created_at
            ) VALUES (
                product_record.id,
                comment_item->>'author_name',
                comment_item->>'comment_text',
                (comment_item->>'rating')::INTEGER,
                (comment_item->>'likes')::INTEGER + (RANDOM() * 5)::INTEGER, -- Varia as curtidas
                (comment_item->>'dislikes')::INTEGER + (RANDOM() * 2)::INTEGER, -- Varia as descurtidas
                NOW() - (RANDOM() * INTERVAL '30 days') -- Data aleatória nos últimos 30 dias
            );
        END LOOP;
        
        RAISE NOTICE 'Comentários adicionados para produto: %', product_record.name;
    END LOOP;
END $$;

-- Comentário sobre a operação
COMMENT ON TABLE public.product_comments IS 'Tabela de comentários dos produtos com avaliações dos clientes';
