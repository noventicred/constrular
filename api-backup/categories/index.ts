import { VercelRequest, VercelResponse } from "@vercel/node";
import { CategoryService } from "../../src/lib/services";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case "GET":
        const categories = await CategoryService.getAllCategories();
        return res.status(200).json({ categories });

      case "POST":
        const newCategory = await CategoryService.createCategory(req.body);
        return res.status(201).json({ category: newCategory });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de categorias:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
