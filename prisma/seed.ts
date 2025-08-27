import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Populando banco com dados de exemplo...");
  
  // Verificar se já existem dados
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("✅ Banco já possui dados. Conectado com sucesso!");
    return;
  }
  
  // Criar usuário admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@constrular.com",
      password: adminPassword,
      fullName: "Administrador",
      isAdmin: true,
    },
  });
  console.log("✅ Usuário admin criado:", admin.email);

  // Criar categorias
  const categoria1 = await prisma.category.create({
    data: {
      name: "Ferramentas",
      description: "Ferramentas para construção e reparo",
      imageUrl: "/placeholder.svg"
    }
  });
  
  const categoria2 = await prisma.category.create({
    data: {
      name: "Material Elétrico",
      description: "Componentes e materiais elétricos",
      imageUrl: "/placeholder.svg"
    }
  });

  // Criar produtos
  await prisma.product.create({
    data: {
      name: "Furadeira Black & Decker 500W",
      description: "Furadeira elétrica profissional com mandril de 13mm",
      price: 189.90,
      originalPrice: 249.90,
      imageUrl: "/placeholder.svg",
      category: "Ferramentas",
      categoryId: categoria1.id,
      brand: "Black & Decker",
      sku: "BD-FUR-500",
      inStock: true,
      stockQuantity: 25,
      isFeatured: true,
      isSpecialOffer: true,
      rating: 4.5,
      reviewCount: 42,
      tags: ["furadeira", "elétrica", "profissional"]
    }
  });

  await prisma.product.create({
    data: {
      name: "Cabo Flexível 2,5mm² - Rolo 100m",
      description: "Cabo flexível para instalações elétricas residenciais",
      price: 285.00,
      imageUrl: "/placeholder.svg",
      category: "Material Elétrico",
      categoryId: categoria2.id,
      brand: "Pirelli",
      sku: "PIR-CAB-25-100",
      inStock: true,
      stockQuantity: 15,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 28,
      tags: ["cabo", "elétrico", "flexível"]
    }
  });

  console.log("🎉 Dados de exemplo criados com sucesso!");
  console.log("👤 Login admin: admin@constrular.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a conexão:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
