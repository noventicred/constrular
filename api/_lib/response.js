/**
 * Utilitários de resposta padronizados para APIs
 */

/**
 * Resposta de sucesso padronizada
 * @param {Response} res - Objeto de resposta
 * @param {*} data - Dados a serem retornados
 * @param {string} message - Mensagem opcional
 * @param {number} status - Status code (padrão: 200)
 */
export function successResponse(res, data, message = 'Success', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Resposta de erro padronizada
 * @param {Response} res - Objeto de resposta
 * @param {string} message - Mensagem de erro
 * @param {number} status - Status code (padrão: 500)
 * @param {*} details - Detalhes adicionais do erro
 */
export function errorResponse(res, message = 'Internal Server Error', status = 500, details = null) {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };

  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }

  return res.status(status).json(response);
}

/**
 * Resposta de validação de erro
 * @param {Response} res - Objeto de resposta
 * @param {Array|Object} errors - Erros de validação
 */
export function validationErrorResponse(res, errors) {
  return res.status(400).json({
    success: false,
    error: 'Validation Error',
    errors: Array.isArray(errors) ? errors : [errors],
    timestamp: new Date().toISOString()
  });
}

/**
 * Resposta de método não permitido
 * @param {Response} res - Objeto de resposta
 * @param {Array} allowedMethods - Métodos permitidos
 */
export function methodNotAllowedResponse(res, allowedMethods = []) {
  res.setHeader('Allow', allowedMethods.join(', '));
  return errorResponse(res, 'Method Not Allowed', 405);
}
