// API de categorias para Vercel
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

  // Mock data para demonstração
  const mockCategories = [
    {
      id: "1",
      name: "Ferramentas",
      description: "Ferramentas para construção",
      imageUrl: "/placeholder.svg",
      parent_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Material Elétrico",
      description: "Materiais elétricos e eletrônicos",
      imageUrl: "/placeholder.svg",
      parent_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Cimento e Argamassa",
      description: "Cimentos, argamassas e materiais de base",
      imageUrl: "/placeholder.svg",
      parent_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Tintas e Vernizes",
      description: "Tintas, vernizes e materiais de acabamento",
      imageUrl: "/placeholder.svg",
      parent_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Hidráulica",
      description: "Materiais hidráulicos e sanitários",
      imageUrl: "/placeholder.svg",
      parent_id: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    switch (req.method) {
      case "GET":
        console.log("📂 API Categorias - Retornando dados mockados");
        return res.status(200).json({ categories: mockCategories });

      case "POST":
        console.log("📂 API Categorias - Criando categoria (mockado)");
        const newCategory = {
          id: Date.now().toString(),
          ...req.body,
          parent_id: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return res.status(201).json({ category: newCategory });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de categorias:", error);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor", details: error.message });
  }
}
