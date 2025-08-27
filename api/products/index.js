/**
 * API de Produtos - Vercel Serverless Function
 * Gerenciamento completo de produtos
 */

import { handleCors } from '../_lib/cors.js';
import { successResponse, errorResponse, methodNotAllowedResponse, validationErrorResponse } from '../_lib/response.js';
import { validateRequiredFields, validateId, sanitizeString, validatePagination } from '../_lib/validation.js';
import { logger } from '../_lib/logger.js';
import { mockProducts } from '../_lib/data.js';

export default async function handler(req, res) {
  // Aplicar CORS
  if (handleCors(req, res)) return;

  // Log da requisição
  logger.request(req);



  try {
    switch (req.method) {
      case 'GET':
        return await handleGetProducts(req, res);
      
      case 'POST':
        return await handleCreateProduct(req, res);
      
      default:
        return methodNotAllowedResponse(res, ['GET', 'POST']);
    }
  } catch (error) {
    logger.error('Erro na API de produtos', error);
    return errorResponse(res, 'Erro interno do servidor', 500, error.message);
  }
}

/**
 * GET /api/products
 * Retorna lista de produtos com filtros e paginação
 */
async function handleGetProducts(req, res) {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    featured,
    specialOffers,
    brand,
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query;

  const { page, limit, offset } = validatePagination(req.query);
  
  let filteredProducts = [...mockProducts];

  // Aplicar filtros
  if (search) {
    const searchTerm = sanitizeString(search).toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  if (categoryId && validateId(categoryId)) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
  }

  if (featured === 'true') {
    filteredProducts = filteredProducts.filter(p => p.isFeatured);
  }

  if (specialOffers === 'true') {
    filteredProducts = filteredProducts.filter(p => p.isSpecialOffer);
  }

  if (inStock === 'true') {
    filteredProducts = filteredProducts.filter(p => p.inStock);
  }

  if (brand) {
    const brandTerm = sanitizeString(brand).toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.brand.toLowerCase().includes(brandTerm)
    );
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
  }

  // Ordenação
  filteredProducts.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === 'desc') {
      return aVal < bVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });

  // Paginação
  const total = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(offset, offset + limit);

  const filters = {
    search, categoryId, minPrice, maxPrice, 
    inStock, featured, specialOffers, brand,
    sortBy, sortOrder
  };

  logger.info(`Produtos encontrados: ${paginatedProducts.length}/${total}`, {
    filters,
    pagination: { page, limit, total }
  });

  return successResponse(res, {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: offset + limit < total,
      hasPrev: page > 1
    },
    filters
  }, 'Produtos recuperados com sucesso');
}

/**
 * POST /api/products
 * Cria um novo produto
 */
async function handleCreateProduct(req, res) {
  const requiredFields = ['name', 'description', 'price', 'categoryId', 'brand'];
  
  // Validação de campos obrigatórios
  const validationErrors = validateRequiredFields(req.body, requiredFields);
  if (validationErrors.length > 0) {
    return validationErrorResponse(res, validationErrors);
  }

  const {
    name, description, price, originalPrice, imageUrl, sku,
    categoryId, brand, stockQuantity, tags, weight, dimensions, warranty
  } = req.body;

  // Validações específicas
  if (isNaN(Number(price)) || Number(price) <= 0) {
    return validationErrorResponse(res, 'Preço deve ser um número positivo');
  }

  if (!validateId(categoryId)) {
    return validationErrorResponse(res, 'ID de categoria inválido');
  }

  // Criar novo produto
  const newProduct = {
    id: Date.now().toString(),
    name: sanitizeString(name),
    description: sanitizeString(description),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    imageUrl: imageUrl || '/placeholder.svg',
    sku: sku || `PRD-${Date.now()}`,
    categoryId: sanitizeString(categoryId),
    brand: sanitizeString(brand),
    isFeatured: false,
    isSpecialOffer: originalPrice && Number(originalPrice) > Number(price),
    inStock: true,
    stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
    rating: 0,
    reviewCount: 0,
    weight: weight ? Number(weight) : null,
    dimensions: dimensions ? sanitizeString(dimensions) : null,
    warranty: warranty ? sanitizeString(warranty) : null,
    tags: Array.isArray(tags) ? tags.map(tag => sanitizeString(tag)) : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  logger.info('Novo produto criado', newProduct);

  return successResponse(res, {
    product: newProduct
  }, 'Produto criado com sucesso', 201);
}
