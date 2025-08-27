// API de registro para Vercel - Usando Prisma e banco real
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
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName) {
      return validationErrorResponse(res, "Email, senha e nome completo são obrigatórios");
    }

    // Verificar se o email já existe no banco
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      logger.warn('Tentativa de registro com email já existente', { email });
      return errorResponse(res, "Email já está em uso", 400);
    }

    logger.info('Criando novo usuário no banco', { email, fullName });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName: fullName,
        phone: phone || null,
        isAdmin: false
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    logger.info('Usuário criado com sucesso no banco', { userId: newUser.id, email: newUser.email });

    return successResponse(res, { user: newUser }, 'Usuário criado com sucesso', 201);
  } catch (error) {
    logger.error("Erro no registro", error);
    
    // Tratar erros específicos do Prisma
    if (error.code === 'P2002') {
      return errorResponse(res, "Email já está em uso", 400);
    }
    
    return errorResponse(res, "Erro interno do servidor", 500, error.message);
  } finally {
    await prisma.$disconnect();
  }
}
