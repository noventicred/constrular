// API de login para Vercel - Usando Prisma e banco real
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { handleCors } from '../_lib/cors.js';
import { successResponse, errorResponse, validationErrorResponse } from '../_lib/response.js';
import { logger } from '../_lib/logger.js';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Aplicar CORS
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return validationErrorResponse(res, "Email e senha são obrigatórios");
    }

    logger.info('Tentativa de login', { email });

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      logger.warn('Tentativa de login com email não encontrado', { email });
      return errorResponse(res, "Credenciais inválidas", 401);
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn('Tentativa de login com senha incorreta', { email });
      return errorResponse(res, "Credenciais inválidas", 401);
    }

    // Retornar dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user;

    logger.info('Login realizado com sucesso', { userId: user.id, email: user.email });

    return successResponse(res, { user: userWithoutPassword }, 'Login realizado com sucesso');
  } catch (error) {
    logger.error("Erro no login", error);
    return errorResponse(res, "Erro interno do servidor", 500, error.message);
  } finally {
    await prisma.$disconnect();
  }
}
