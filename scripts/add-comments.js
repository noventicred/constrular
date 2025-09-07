// ============================================================================
// SCRIPT PARA ADICIONAR COMENTÁRIOS POSITIVOS AOS PRODUTOS
// ============================================================================
// Execute este script no console do navegador (F12) quando estiver logado como admin

async function addPositiveComments() {
  // Comentários positivos realistas
  const positiveComments = [
    {
      author_name: "Maria Silva",
      comment_text: "Excelente produto! Qualidade superior, entrega rápida e preço justo. Já comprei várias vezes e sempre fico satisfeita. Recomendo!",
      rating: 5,
      likes: 12,
      dislikes: 0
    },
    {
      author_name: "João Santos",
      comment_text: "Produto de ótima qualidade. Chegou no prazo e bem embalado. Atendeu perfeitamente às minhas expectativas. Voltarei a comprar.",
      rating: 5,
      likes: 8,
      dislikes: 1
    },
    {
      author_name: "Ana Costa",
      comment_text: "Muito bom! A qualidade é excelente e o preço é competitivo. Entrega foi super rápida. Estou muito satisfeita com a compra.",
      rating: 4,
      likes: 15,
      dislikes: 0
    },
    {
      author_name: "Carlos Oliveira",
      comment_text: "Produto conforme descrito. Boa qualidade e chegou certinho. O atendimento da loja também foi muito bom. Recomendo!",
      rating: 4,
      likes: 6,
      dislikes: 0
    },
    {
      author_name: "Fernanda Lima",
      comment_text: "Adorei o produto! Qualidade excelente, embalagem caprichada e entrega super rápida. Já indiquei para várias amigas!",
      rating: 5,
      likes: 20,
      dislikes: 0
    },
    {
      author_name: "Roberto Pereira",
      comment_text: "Muito satisfeito com a compra. Produto de qualidade, preço bom e entrega no prazo. Loja confiável, já comprei outras vezes.",
      rating: 4,
      likes: 9,
      dislikes: 1
    },
    {
      author_name: "Juliana Rodrigues",
      comment_text: "Produto maravilhoso! Superou minhas expectativas. Qualidade top e entrega rapidíssima. Virei cliente fiel dessa loja!",
      rating: 5,
      likes: 18,
      dislikes: 0
    },
    {
      author_name: "Paulo Mendes",
      comment_text: "Excelente custo-benefício! Produto chegou perfeito, bem embalado e no prazo. Atendimento nota 10. Super recomendo!",
      rating: 4,
      likes: 11,
      dislikes: 0
    },
    {
      author_name: "Carla Ferreira",
      comment_text: "Produto de primeira qualidade! Entrega foi super rápida e o produto veio exatamente como esperado. Muito satisfeita!",
      rating: 5,
      likes: 14,
      dislikes: 0
    },
    {
      author_name: "Ricardo Alves",
      comment_text: "Ótima compra! Produto de qualidade, preço justo e entrega rápida. Loja séria e confiável. Já fiz várias compras aqui.",
      rating: 4,
      likes: 7,
      dislikes: 0
    },
    {
      author_name: "Luciana Martins",
      comment_text: "Produto excelente! Chegou rapidinho e com ótima qualidade. Atendimento impecável. Já virou minha loja favorita!",
      rating: 5,
      likes: 16,
      dislikes: 0
    },
    {
      author_name: "André Costa",
      comment_text: "Muito bom produto! Qualidade conforme esperado, entrega no prazo e preço competitivo. Recomendo sem dúvidas!",
      rating: 4,
      likes: 10,
      dislikes: 1
    }
  ];

  try {
    // Buscar produtos existentes
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .eq('in_stock', true)
      .limit(15);

    if (productsError) {
      console.error('Erro ao buscar produtos:', productsError);
      return;
    }

    if (!products || products.length === 0) {
      console.log('Nenhum produto encontrado');
      return;
    }

    console.log(`Encontrados ${products.length} produtos. Adicionando comentários...`);

    let totalCommentsAdded = 0;

    // Para cada produto, adicionar 2-4 comentários aleatórios
    for (const product of products) {
      const numComments = 2 + Math.floor(Math.random() * 3); // 2-4 comentários
      console.log(`Adicionando ${numComments} comentários para: ${product.name}`);

      for (let i = 0; i < numComments; i++) {
        // Selecionar comentário aleatório
        const randomComment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
        
        // Variar ligeiramente as curtidas para parecer mais natural
        const likes = randomComment.likes + Math.floor(Math.random() * 5);
        const dislikes = randomComment.dislikes + Math.floor(Math.random() * 2);

        // Inserir comentário
        const { error: commentError } = await supabase
          .from('product_comments')
          .insert([{
            product_id: product.id,
            author_name: randomComment.author_name,
            comment_text: randomComment.comment_text,
            rating: randomComment.rating,
            likes: likes,
            dislikes: dislikes
          }]);

        if (commentError) {
          console.error(`Erro ao adicionar comentário para ${product.name}:`, commentError);
        } else {
          totalCommentsAdded++;
        }
      }
    }

    console.log(`✅ Processo concluído! ${totalCommentsAdded} comentários adicionados com sucesso!`);
    console.log('🎉 Agora seus produtos têm avaliações positivas!');
    
    // Recarregar a página para ver os resultados
    if (window.location.pathname.includes('/admin')) {
      console.log('💡 Recarregue a página para ver os comentários nos produtos!');
    }

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar a função
console.log('🚀 Iniciando adição de comentários positivos...');
addPositiveComments();
