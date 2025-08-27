import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Testando conexão com o banco...");

  // Apenas testa a conexão
  await prisma.$connect();
  console.log("✅ Conexão estabelecida com sucesso!");

  console.log("📋 Schema criado e pronto para uso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a conexão:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
