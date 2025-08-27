import { VercelRequest, VercelResponse } from "@vercel/node";

// Mock data para demonstração
const mockCategories = [
  {
    id: "1",
    name: "Ferramentas",
    description: "Ferramentas para construção",
    imageUrl: "/placeholder.svg",
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Material Elétrico",
    description: "Materiais elétricos e eletrônicos",
    imageUrl: "/placeholder.svg",
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Cimento e Argamassa", 
    description: "Cimentos, argamassas e materiais de base",
    imageUrl: "/placeholder.svg",
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return res.status(201).json({ category: newCategory });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de categorias:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
