import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Configuração para Neon no ambiente de produção
const createPrismaClient = () => {
  if (process.env.DATABASE_URL) {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  // Fallback para desenvolvimento local
  return new PrismaClient();
};

const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

export { prisma };

// Cliente Neon para queries diretas se necessário
export const sql = neon(process.env.DATABASE_URL || "");
