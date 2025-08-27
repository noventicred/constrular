import { VercelRequest, VercelResponse } from "@vercel/node";
import { ProductService } from "../../src/lib/services";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case "GET":
        const { search, categoryId, minPrice, maxPrice, inStock } = req.query;

        if (search) {
          const products = await ProductService.searchProducts(
            search as string,
            {
              categoryId: categoryId as string,
              minPrice: minPrice ? Number(minPrice) : undefined,
              maxPrice: maxPrice ? Number(maxPrice) : undefined,
              inStock: inStock ? inStock === "true" : undefined,
            }
          );
          return res.status(200).json(products);
        }

        const products = await ProductService.getAllProducts();
        return res.status(200).json(products);

      case "POST":
        const newProduct = await ProductService.createProduct(req.body);
        return res.status(201).json(newProduct);

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
