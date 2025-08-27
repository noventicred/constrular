/**
 * Utilitários CORS para APIs Vercel
 * Configuração centralizada de headers CORS
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 horas
};

/**
 * Aplica headers CORS na resposta
 * @param {Response} res - Objeto de resposta do Vercel
 */
export function applyCors(res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

/**
 * Middleware CORS para APIs
 * @param {Request} req - Objeto de requisição
 * @param {Response} res - Objeto de resposta
 * @returns {boolean} - true se é uma requisição OPTIONS
 */
export function handleCors(req, res) {
  applyCors(res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  return false;
}
