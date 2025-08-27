/**
 * API de Configurações - Vercel Serverless Function
 * Gerenciamento das configurações da loja
 */

import { handleCors } from '../_lib/cors.js';
import { successResponse, errorResponse, methodNotAllowedResponse } from '../_lib/response.js';
import { sanitizeString } from '../_lib/validation.js';
import { logger } from '../_lib/logger.js';
import { mockSettings } from '../_lib/data.js';

export default async function handler(req, res) {
  // Aplicar CORS
  if (handleCors(req, res)) return;

  // Log da requisição
  logger.request(req);

  try {
    switch (req.method) {
      case 'GET':
        return await handleGetSettings(req, res);
      
      case 'PUT':
        return await handleUpdateSettings(req, res);
      
      default:
        return methodNotAllowedResponse(res, ['GET', 'PUT']);
    }
  } catch (error) {
    logger.error('Erro na API de configurações', error);
    return errorResponse(res, 'Erro interno do servidor', 500, error.message);
  }
}

/**
 * GET /api/settings
 * Retorna as configurações da loja
 */
async function handleGetSettings(req, res) {
  const { category } = req.query;
  
  let settings = { ...mockSettings };
  
  // Filtrar por categoria se especificado
  if (category) {
    const validCategories = ['store', 'shipping', 'payment', 'seo', 'social', 'features'];
    
    if (validCategories.includes(category)) {
      const categorySettings = {};
      
      switch (category) {
        case 'store':
          categorySettings.store = {
            name: settings.store_name,
            email: settings.store_email,
            phone: settings.store_phone,
            address: settings.store_address,
            business_hours: settings.business_hours
          };
          break;
        case 'shipping':
          categorySettings.shipping = {
            free_shipping_threshold: settings.free_shipping_threshold,
            default_shipping_cost: settings.default_shipping_cost,
            delivery_areas: settings.delivery_areas
          };
          break;
        case 'payment':
          categorySettings.payment = {
            methods: settings.payment_methods
          };
          break;
        case 'seo':
          categorySettings.seo = settings.seo;
          break;
        case 'social':
          categorySettings.social_media = settings.social_media;
          break;
        case 'features':
          categorySettings.features = settings.features;
          break;
      }
      
      settings = categorySettings;
    }
  }

  logger.info('Configurações recuperadas', { category });

  return successResponse(res, {
    settings,
    category: category || 'all'
  }, 'Configurações recuperadas com sucesso');
}

/**
 * PUT /api/settings
 * Atualiza as configurações da loja
 */
async function handleUpdateSettings(req, res) {
  const updates = req.body;
  
  if (!updates || typeof updates !== 'object') {
    return errorResponse(res, 'Dados de atualização inválidos', 400);
  }

  // Sanitizar strings nos updates
  const sanitizedUpdates = {};
  
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value === 'string') {
      sanitizedUpdates[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitizedUpdates[key] = value;
    } else {
      sanitizedUpdates[key] = value;
    }
  }

  // Simular atualização das configurações
  const updatedSettings = {
    ...mockSettings,
    ...sanitizedUpdates,
    updated_at: new Date().toISOString()
  };

  logger.info('Configurações atualizadas', { 
    updates: Object.keys(sanitizedUpdates),
    timestamp: updatedSettings.updated_at
  });

  return successResponse(res, {
    settings: updatedSettings,
    updated_fields: Object.keys(sanitizedUpdates)
  }, 'Configurações atualizadas com sucesso');
}
