/**
 * Formata um valor numérico para moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um valor numérico simples no padrão brasileiro
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Gera um número de pedido legível a partir do UUID
 */
export const formatOrderNumber = (uuid: string): string => {
  // Pega os primeiros 8 caracteres do UUID e converte para número
  const hexString = uuid.replace(/-/g, '').substring(0, 8);
  const number = parseInt(hexString, 16);
  // Retorna um número de 6 dígitos
  return (number % 900000 + 100000).toString();
};