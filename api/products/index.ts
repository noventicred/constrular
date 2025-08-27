import { VercelRequest, VercelResponse } from "@vercel/node";

// Mock data para demonstração
const mockProducts = [
  {
    id: "1",
    name: "Furadeira Black & Decker 500W",
    price: 189.9,
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
    updatedAt: "2024-01-15T00:00:00.000Z"
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
    updatedAt: "2024-01-20T00:00:00.000Z"
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case "GET":
        const { search, categoryId, minPrice, maxPrice, inStock, featured, specialOffers } = req.query;

        console.log("🛍️ API Produtos - Retornando dados mockados");

        let filteredProducts = [...mockProducts];

        if (search) {
          const searchTerm = (search as string).toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm)
          );
        }

        if (categoryId) {
          filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
        }

        if (featured === "true") {
          filteredProducts = filteredProducts.filter(p => p.isFeatured);
        }

        if (specialOffers === "true") {
          filteredProducts = filteredProducts.filter(p => p.isSpecialOffer);
        }

        if (inStock === "true") {
          filteredProducts = filteredProducts.filter(p => p.inStock);
        }

        if (minPrice) {
          filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
        }

        if (maxPrice) {
          filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
        }

        return res.status(200).json({ products: filteredProducts });

      case "POST":
        console.log("🛍️ API Produtos - Criando produto (mockado)");
        const newProduct = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return res.status(201).json({ product: newProduct });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
