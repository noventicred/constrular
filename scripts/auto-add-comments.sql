-- ============================================================================
-- SCRIPT AUTOMÁTICO PARA ADICIONAR COMENTÁRIOS POSITIVOS
-- ============================================================================
-- Execute este SQL no Dashboard do Supabase para adicionar comentários automaticamente

DO $$
DECLARE
    product_record RECORD;
    comment_texts TEXT[] := ARRAY[
        'Excelente produto! Qualidade superior, entrega rápida e preço justo. Já comprei várias vezes e sempre fico satisfeita. Recomendo!',
        'Produto de ótima qualidade. Chegou no prazo e bem embalado. Atendeu perfeitamente às minhas expectativas. Voltarei a comprar.',
        'Muito bom! A qualidade é excelente e o preço é competitivo. Entrega foi super rápida. Estou muito satisfeita com a compra.',
        'Produto conforme descrito. Boa qualidade e chegou certinho. O atendimento da loja também foi muito bom. Recomendo!',
        'Adorei o produto! Qualidade excelente, embalagem caprichada e entrega super rápida. Já indiquei para várias amigas!',
        'Muito satisfeito com a compra. Produto de qualidade, preço bom e entrega no prazo. Loja confiável, já comprei outras vezes.',
        'Produto maravilhoso! Superou minhas expectativas. Qualidade top e entrega rapidíssima. Virei cliente fiel dessa loja!',
        'Excelente custo-benefício! Produto chegou perfeito, bem embalado e no prazo. Atendimento nota 10. Super recomendo!',
        'Produto de primeira qualidade! Entrega foi super rápida e o produto veio exatamente como esperado. Muito satisfeita!',
        'Ótima compra! Produto de qualidade, preço justo e entrega rápida. Loja séria e confiável. Já fiz várias compras aqui.',
        'Produto excelente! Chegou rapidinho e com ótima qualidade. Atendimento impecável. Já virou minha loja favorita!',
        'Muito bom produto! Qualidade conforme esperado, entrega no prazo e preço competitivo. Recomendo sem dúvidas!'
    ];
    
    author_names TEXT[] := ARRAY[
        'Maria Silva',
        'João Santos', 
        'Ana Costa',
        'Carlos Oliveira',
        'Fernanda Lima',
        'Roberto Pereira',
        'Juliana Rodrigues',
        'Paulo Mendes',
        'Carla Ferreira',
        'Ricardo Alves',
        'Luciana Martins',
        'André Costa',
        'Beatriz Souza',
        'Marcos Lima',
        'Patrícia Rocha'
    ];
    
    ratings INTEGER[] := ARRAY[4, 4, 4, 5, 5, 5, 5, 4, 5, 4];
    
    i INTEGER;
    num_comments INTEGER;
    random_comment_index INTEGER;
    random_author_index INTEGER;
    random_rating INTEGER;
    random_likes INTEGER;
    random_dislikes INTEGER;
    total_added INTEGER := 0;
BEGIN
    -- Para cada produto ativo, adicionar comentários
    FOR product_record IN 
        SELECT id, name FROM public.products 
        WHERE in_stock = true 
        ORDER BY created_at DESC
    LOOP
        -- Adicionar 3-6 comentários por produto
        num_comments := 3 + (RANDOM() * 4)::INTEGER;
        
        FOR i IN 1..num_comments LOOP
            -- Selecionar índices aleatórios
            random_comment_index := 1 + (RANDOM() * (array_length(comment_texts, 1) - 1))::INTEGER;
            random_author_index := 1 + (RANDOM() * (array_length(author_names, 1) - 1))::INTEGER;
            random_rating := ratings[1 + (RANDOM() * (array_length(ratings, 1) - 1))::INTEGER];
            random_likes := 3 + (RANDOM() * 17)::INTEGER; -- Entre 3 e 20 curtidas
            random_dislikes := (RANDOM() * 2)::INTEGER; -- 0-2 descurtidas
            
            -- Inserir comentário
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
                author_names[random_author_index],
                comment_texts[random_comment_index],
                random_rating,
                random_likes,
                random_dislikes,
                NOW() - (RANDOM() * INTERVAL '30 days') -- Data aleatória nos últimos 30 dias
            );
            
            total_added := total_added + 1;
        END LOOP;
        
        RAISE NOTICE 'Adicionados % comentários para: %', num_comments, product_record.name;
    END LOOP;
    
    RAISE NOTICE '✅ CONCLUÍDO! Total de % comentários adicionados!', total_added;
    RAISE NOTICE '🎉 Seus produtos agora têm avaliações positivas!';
END $$;
