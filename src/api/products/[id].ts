import { VercelRequest, VercelResponse } from "@vercel/node";
import { ProductService } from "../../lib/services";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "ID do produto é obrigatório" });
    }

    switch (req.method) {
      case "GET":
        const product = await ProductService.getProductById(id);
        if (!product) {
          return res.status(404).json({ error: "Produto não encontrado" });
        }
        return res.status(200).json(product);

      case "PUT":
        const updatedProduct = await ProductService.updateProduct(id, req.body);
        return res.status(200).json(updatedProduct);

      case "DELETE":
        await ProductService.deleteProduct(id);
        return res.status(204).end();

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Erro na API de produto:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
