#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🔗 Configuração do Banco Neon para o Constrular\n");

rl.question("Cole aqui sua CONNECTION STRING do Neon: ", (input) => {
  // Extrair a connection string se vier com comando psql
  let databaseUrl = input.trim();
  if (databaseUrl.startsWith("psql '") && databaseUrl.endsWith("'")) {
    databaseUrl = databaseUrl.slice(6, -1); // Remove "psql '" do início e "'" do final
  }

  if (!databaseUrl.includes("postgresql://")) {
    console.log('❌ A connection string deve começar com "postgresql://"');
    rl.close();
    return;
  }

  const envContent = `# 🔗 Configuração do Banco de Dados Neon
DATABASE_URL="${databaseUrl}"

# 🌐 URLs da Aplicação (desenvolvimento local)
VITE_APP_URL="http://localhost:3000"
VITE_API_URL="http://localhost:3000/api"

# 📅 Gerado em: ${new Date().toLocaleString("pt-BR")}
`;

  const envPath = path.join(projectRoot, ".env.local");

  try {
    fs.writeFileSync(envPath, envContent);
    console.log("\n✅ Arquivo .env.local criado com sucesso!");
    console.log("\n📋 Próximos passos:");
    console.log("1. npm run db:generate  # Gerar cliente Prisma");
    console.log("2. npm run db:deploy    # Criar tabelas no banco");
    console.log("3. npm run db:seed      # Popular dados iniciais (opcional)");
    console.log("4. npm run dev          # Testar localmente");
    console.log("\n🚀 Para deploy no Vercel:");
    console.log("- Configure as mesmas variáveis no Vercel Dashboard");
    console.log("- Veja o arquivo CONEXAO-NEON.md para instruções detalhadas");
  } catch (error) {
    console.error("❌ Erro ao criar .env.local:", error.message);
  }

  rl.close();
});
