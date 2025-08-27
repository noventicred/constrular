/**
 * Utilitários de validação para APIs
 */

/**
 * Valida se os campos obrigatórios estão presentes
 * @param {Object} data - Dados a serem validados
 * @param {Array} requiredFields - Campos obrigatórios
 * @returns {Array} - Array de erros (vazio se válido)
 */
export function validateRequiredFields(data, requiredFields) {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Campo '${field}' é obrigatório`);
    }
  });
  
  return errors;
}

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - true se válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se o ID é válido
 * @param {string} id - ID a ser validado
 * @returns {boolean} - true se válido
 */
export function validateId(id) {
  return typeof id === 'string' && id.trim().length > 0;
}

/**
 * Valida parâmetros de paginação
 * @param {Object} query - Query parameters
 * @returns {Object} - Parâmetros validados com defaults
 */
export function validatePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

/**
 * Sanitiza string removendo caracteres perigosos
 * @param {string} str - String a ser sanitizada
 * @returns {string} - String sanitizada
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
