// API de produtos para Vercel
export default async function handler(req, res) {
  // Headers CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Mock data para demonstração - produtos expandidos
  const mockProducts = [
    {
      id: "1",
      name: "Furadeira Black & Decker 500W",
      price: 189.9,
      originalPrice: 229.9,
      imageUrl: "/placeholder.svg",
      sku: "BD-FUR-500",
      category: "Ferramentas",
      categoryId: "1",
      isFeatured: true,
      isSpecialOffer: true,
      inStock: true,
      stockQuantity: 25,
      description: "Furadeira elétrica profissional com mandril de 13mm",
      brand: "Black & Decker",
      rating: 4.5,
      reviewCount: 42,
      tags: ["furadeira", "elétrica", "profissional"],
      createdAt: "2024-01-15T00:00:00.000Z",
      updatedAt: "2024-01-15T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Cabo Flexível 2,5mm²",
      price: 28.5,
      imageUrl: "/placeholder.svg",
      sku: "PIR-CAB-25",
      category: "Material Elétrico",
      categoryId: "2",
      isFeatured: true,
      isSpecialOffer: false,
      inStock: true,
      stockQuantity: 15,
      description: "Cabo flexível para instalações elétricas residenciais",
      brand: "Pirelli",
      rating: 4.8,
      reviewCount: 28,
      tags: ["cabo", "elétrico", "flexível"],
      createdAt: "2024-01-20T00:00:00.000Z",
      updatedAt: "2024-01-20T00:00:00.000Z",
    },
    {
      id: "3",
      name: "Cimento Portland 50kg",
      price: 35.9,
      originalPrice: 42.9,
      imageUrl: "/placeholder.svg",
      sku: "VOT-CIM-50",
      category: "Cimento e Argamassa",
      categoryId: "3",
      isFeatured: false,
      isSpecialOffer: true,
      inStock: true,
      stockQuantity: 50,
      description: "Cimento Portland comum para construção civil",
      brand: "Votorantim",
      rating: 4.6,
      reviewCount: 89,
      tags: ["cimento", "portland", "construção"],
      createdAt: "2024-01-22T00:00:00.000Z",
      updatedAt: "2024-01-22T00:00:00.000Z",
    },
    {
      id: "4",
      name: "Tinta Acrílica Premium 18L",
      price: 125.9,
      imageUrl: "/placeholder.svg",
      sku: "SUV-TIN-18",
      category: "Tintas e Vernizes",
      categoryId: "4",
      isFeatured: true,
      isSpecialOffer: false,
      inStock: true,
      stockQuantity: 12,
      description: "Tinta acrílica premium para paredes internas e externas",
      brand: "Suvinil",
      rating: 4.7,
      reviewCount: 67,
      tags: ["tinta", "acrílica", "premium"],
      createdAt: "2024-01-25T00:00:00.000Z",
      updatedAt: "2024-01-25T00:00:00.000Z",
    },
    {
      id: "5",
      name: "Registro de Gaveta 3/4",
      price: 45.9,
      originalPrice: 52.9,
      imageUrl: "/placeholder.svg",
      sku: "DOC-REG-34",
      category: "Hidráulica",
      categoryId: "5",
      isFeatured: false,
      isSpecialOffer: true,
      inStock: true,
      stockQuantity: 8,
      description: "Registro de gaveta em bronze 3/4 polegada",
      brand: "Docol",
      rating: 4.4,
      reviewCount: 23,
      tags: ["registro", "gaveta", "hidráulica"],
      createdAt: "2024-01-28T00:00:00.000Z",
      updatedAt: "2024-01-28T00:00:00.000Z",
    },
    {
      id: "6",
      name: "Parafusadeira Bosch 12V",
      price: 299.9,
      imageUrl: "/placeholder.svg",
      sku: "BSH-PAR-12",
      category: "Ferramentas",
      categoryId: "1",
      isFeatured: true,
      isSpecialOffer: false,
      inStock: true,
      stockQuantity: 18,
      description: "Parafusadeira sem fio com bateria de 12V e carregador",
      brand: "Bosch",
      rating: 4.9,
      reviewCount: 156,
      tags: ["parafusadeira", "sem fio", "bateria"],
      createdAt: "2024-01-30T00:00:00.000Z",
      updatedAt: "2024-01-30T00:00:00.000Z",
    },
  ];

  try {
    switch (req.method) {
      case "GET":
        const {
          search,
          categoryId,
          minPrice,
          maxPrice,
          inStock,
          featured,
          specialOffers,
        } = req.query;

        console.log("🛍️ API Produtos - Retornando dados mockados", {
          search,
          categoryId,
          featured,
          specialOffers,
          inStock,
        });

        let filteredProducts = [...mockProducts];

        if (search) {
          const searchTerm = search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(searchTerm) ||
              p.description.toLowerCase().includes(searchTerm) ||
              p.brand.toLowerCase().includes(searchTerm) ||
              p.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
          console.log(
            `🔍 Filtro de busca "${search}": ${filteredProducts.length} produtos`
          );
        }

        if (categoryId) {
          filteredProducts = filteredProducts.filter(
            (p) => p.categoryId === categoryId
          );
          console.log(
            `📂 Filtro categoria "${categoryId}": ${filteredProducts.length} produtos`
          );
        }

        if (featured === "true") {
          filteredProducts = filteredProducts.filter((p) => p.isFeatured);
          console.log(
            `⭐ Filtro produtos em destaque: ${filteredProducts.length} produtos`
          );
        }

        if (specialOffers === "true") {
          filteredProducts = filteredProducts.filter((p) => p.isSpecialOffer);
          console.log(
            `🏷️ Filtro ofertas especiais: ${filteredProducts.length} produtos`
          );
        }

        if (inStock === "true") {
          filteredProducts = filteredProducts.filter((p) => p.inStock);
          console.log(
            `📦 Filtro em estoque: ${filteredProducts.length} produtos`
          );
        }

        if (minPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= Number(minPrice)
          );
          console.log(
            `💰 Filtro preço mínimo R$${minPrice}: ${filteredProducts.length} produtos`
          );
        }

        if (maxPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price <= Number(maxPrice)
          );
          console.log(
            `💰 Filtro preço máximo R$${maxPrice}: ${filteredProducts.length} produtos`
          );
        }

        return res.status(200).json({ products: filteredProducts });

      case "POST":
        console.log("🛍️ API Produtos - Criando produto (mockado)");
        const newProduct = {
          id: Date.now().toString(),
          ...req.body,
          isFeatured: false,
          isSpecialOffer: false,
          inStock: true,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return res.status(201).json({ product: newProduct });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
