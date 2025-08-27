/**
 * API de Categorias - Vercel Serverless Function
 * Gerenciamento de categorias de produtos
 */

import { handleCors } from '../_lib/cors.js';
import { successResponse, errorResponse, methodNotAllowedResponse, validationErrorResponse } from '../_lib/response.js';
import { validateRequiredFields, validateId, sanitizeString } from '../_lib/validation.js';
import { logger } from '../_lib/logger.js';
import { mockCategories } from '../_lib/data.js';

export default async function handler(req, res) {
  // Aplicar CORS
  if (handleCors(req, res)) return;

  // Log da requisição
  logger.request(req);

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetCategories(req, res);
      
      case 'POST':
        return await handleCreateCategory(req, res);
      
      default:
        return methodNotAllowedResponse(res, ['GET', 'POST']);
    }
  } catch (error) {
    logger.error('Erro na API de categorias', error);
    return errorResponse(res, 'Erro interno do servidor', 500, error.message);
  }
}

/**
 * GET /api/categories
 * Retorna lista de categorias com filtros opcionais
 */
async function handleGetCategories(req, res) {
  const { active, parent_id, search } = req.query;
  
  let filteredCategories = [...mockCategories];

  // Filtrar por status ativo
  if (active !== undefined) {
    const isActive = active === 'true';
    filteredCategories = filteredCategories.filter(cat => cat.active === isActive);
  }

  // Filtrar por categoria pai
  if (parent_id !== undefined) {
    filteredCategories = filteredCategories.filter(cat => cat.parent_id === parent_id);
  }

  // Busca por texto
  if (search) {
    const searchTerm = sanitizeString(search).toLowerCase();
    filteredCategories = filteredCategories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm) ||
      cat.description.toLowerCase().includes(searchTerm)
    );
  }

  logger.info(`Categorias encontradas: ${filteredCategories.length}`, {
    filters: { active, parent_id, search },
    total: filteredCategories.length
  });

  return successResponse(res, {
    categories: filteredCategories,
    total: filteredCategories.length,
    filters: { active, parent_id, search }
  }, 'Categorias recuperadas com sucesso');
}

/**
 * POST /api/categories
 * Cria uma nova categoria
 */
async function handleCreateCategory(req, res) {
  const { name, description, imageUrl, parent_id } = req.body;

  // Validação de campos obrigatórios
  const validationErrors = validateRequiredFields(req.body, ['name', 'description']);
  if (validationErrors.length > 0) {
    return validationErrorResponse(res, validationErrors);
  }

  // Validar parent_id se fornecido
  if (parent_id && !validateId(parent_id)) {
    return validationErrorResponse(res, 'parent_id inválido');
  }

  // Criar nova categoria
  const newCategory = {
    id: Date.now().toString(),
    name: sanitizeString(name),
    description: sanitizeString(description),
    imageUrl: imageUrl || '/placeholder.svg',
    parent_id: parent_id || null,
    slug: sanitizeString(name).toLowerCase().replace(/\s+/g, '-'),
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  logger.info('Nova categoria criada', newCategory);

  return successResponse(res, {
    category: newCategory
  }, 'Categoria criada com sucesso', 201);
}
