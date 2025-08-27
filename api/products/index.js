/**
 * API de Produtos - Vercel Serverless Function
 * Gerenciamento completo de produtos usando Prisma e banco real
 */

import { PrismaClient } from '@prisma/client';
import { handleCors } from '../_lib/cors.js';
import { successResponse, errorResponse, methodNotAllowedResponse, validationErrorResponse } from '../_lib/response.js';
import { validateRequiredFields, validateId, sanitizeString, validatePagination } from '../_lib/validation.js';
import { logger } from '../_lib/logger.js';

const prisma = new PrismaClient();

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
  try {
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
    
    // Construir filtros do Prisma
    const where = {};

    if (search) {
      const searchTerm = sanitizeString(search);
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { brand: { contains: searchTerm, mode: 'insensitive' } },
        { tags: { has: searchTerm } }
      ];
    }

    if (categoryId && validateId(categoryId)) {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (specialOffers === 'true') {
      where.isSpecialOffer = true;
    }

    if (inStock === 'true') {
      where.inStock = true;
    }

    if (brand) {
      where.brand = { contains: sanitizeString(brand), mode: 'insensitive' };
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      where.price = { ...where.price, gte: Number(minPrice) };
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      where.price = { ...where.price, lte: Number(maxPrice) };
    }

    // Construir ordenação
    const orderBy = {};
    if (sortBy === 'price' || sortBy === 'rating') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Buscar produtos no banco
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          categoryRelation: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    // Formatar produtos para o frontend
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
      imageUrl: product.imageUrl || '/placeholder.svg',
      category: product.categoryRelation?.name || product.category,
      categoryId: product.categoryId,
      brand: product.brand,
      sku: product.sku,
      isFeatured: product.isFeatured,
      isSpecialOffer: product.isSpecialOffer,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      rating: product.rating ? Number(product.rating) : null,
      reviewCount: product.reviewCount,
      weight: product.weight ? Number(product.weight) : null,
      dimensions: product.dimensions,
      tags: product.tags,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }));

    const filters = {
      search, categoryId, minPrice, maxPrice, 
      inStock, featured, specialOffers, brand,
      sortBy, sortOrder
    };

    logger.info(`Produtos encontrados no banco: ${formattedProducts.length}/${total}`, {
      filters,
      pagination: { page, limit, total }
    });

    return successResponse(res, {
      products: formattedProducts || [],
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
  } catch (error) {
    logger.error('Erro ao buscar produtos no banco', error);
    return errorResponse(res, 'Erro ao carregar produtos', 500, error.message);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/products
 * Cria um novo produto
 */
async function handleCreateProduct(req, res) {
  try {
    const requiredFields = ['name', 'description', 'price', 'categoryId', 'brand'];
    
    // Validação de campos obrigatórios
    const validationErrors = validateRequiredFields(req.body, requiredFields);
    if (validationErrors.length > 0) {
      return validationErrorResponse(res, validationErrors);
    }

    const {
      name, description, price, originalPrice, imageUrl, sku,
      categoryId, brand, stockQuantity, tags, weight, dimensions
    } = req.body;

    // Validações específicas
    if (isNaN(Number(price)) || Number(price) <= 0) {
      return validationErrorResponse(res, 'Preço deve ser um número positivo');
    }

    if (!validateId(categoryId)) {
      return validationErrorResponse(res, 'ID de categoria inválido');
    }

    // Verificar se a categoria existe
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return validationErrorResponse(res, 'Categoria não encontrada');
    }

    // Criar novo produto no banco
    const newProduct = await prisma.product.create({
      data: {
        name: sanitizeString(name),
        description: sanitizeString(description),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        imageUrl: imageUrl || '/placeholder.svg',
        sku: sku || `PRD-${Date.now()}`,
        categoryId: sanitizeString(categoryId),
        category: categoryExists.name,
        brand: sanitizeString(brand),
        isFeatured: false,
        isSpecialOffer: originalPrice && Number(originalPrice) > Number(price),
        inStock: true,
        stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
        rating: 0,
        reviewCount: 0,
        weight: weight ? Number(weight) : null,
        dimensions: dimensions ? sanitizeString(dimensions) : null,
        tags: Array.isArray(tags) ? tags.map(tag => sanitizeString(tag)) : []
      },
      include: {
        categoryRelation: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Formatar produto para resposta
    const formattedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      imageUrl: newProduct.imageUrl,
      category: newProduct.categoryRelation?.name || newProduct.category,
      categoryId: newProduct.categoryId,
      brand: newProduct.brand,
      sku: newProduct.sku,
      isFeatured: newProduct.isFeatured,
      isSpecialOffer: newProduct.isSpecialOffer,
      inStock: newProduct.inStock,
      stockQuantity: newProduct.stockQuantity,
      rating: newProduct.rating ? Number(newProduct.rating) : null,
      reviewCount: newProduct.reviewCount,
      weight: newProduct.weight ? Number(newProduct.weight) : null,
      dimensions: newProduct.dimensions,
      tags: newProduct.tags,
      createdAt: newProduct.createdAt.toISOString(),
      updatedAt: newProduct.updatedAt.toISOString()
    };

    logger.info('Novo produto criado no banco', { productId: newProduct.id, name: newProduct.name });

    return successResponse(res, {
      product: formattedProduct
    }, 'Produto criado com sucesso', 201);
  } catch (error) {
    logger.error('Erro ao criar produto no banco', error);
    
    // Tratar erros específicos do Prisma
    if (error.code === 'P2002') {
      return errorResponse(res, 'SKU já está em uso', 400);
    }
    
    return errorResponse(res, 'Erro ao criar produto', 500, error.message);
  } finally {
    await prisma.$disconnect();
  }
}
