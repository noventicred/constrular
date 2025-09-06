// ============================================================================
// CONSTANTES GLOBAIS - NOVA CASA CONSTRUÇÃO
// ============================================================================
// Este arquivo centraliza todas as constantes do projeto
// ============================================================================

// ============================================================================
// CONFIGURAÇÕES DA APLICAÇÃO
// ============================================================================

export const APP_CONFIG = {
  name: "Nova Casa Construção",
  description: "Loja completa de material de construção com os melhores preços",
  version: "1.0.0",
  author: "Nova Casa Construção",
  url: typeof window !== "undefined" ? window.location.origin : "",
} as const;

// ============================================================================
// CONFIGURAÇÕES DE PAGINAÇÃO
// ============================================================================

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  ADMIN_LIMIT: 20,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE VALIDAÇÃO
// ============================================================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999.99,
  MAX_DISCOUNT: 90,
  PHONE_REGEX:
    /^(?:\+55\s?)?(?:\(\d{2}\)\s?|\d{2}\s?)(?:9\s?)?\d{4}[-\s]?\d{4}$/,
  CPF_REGEX: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ_REGEX: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  ZIP_CODE_REGEX: /^\d{5}-?\d{3}$/,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE TOAST
// ============================================================================

export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  WARNING_DURATION: 4000,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE CACHE
// ============================================================================

export const CACHE_KEYS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  USER_PROFILE: "user_profile",
  CART: "cart",
  SETTINGS: "settings",
  SEARCH_RESULTS: "search_results",
} as const;

export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutos
  MEDIUM: 15 * 60 * 1000, // 15 minutos
  LONG: 60 * 60 * 1000, // 1 hora
} as const;

// ============================================================================
// ROTAS DA APLICAÇÃO
// ============================================================================

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/produtos",
  PRODUCT: "/produto",
  CART: "/carrinho",
  CHECKOUT: "/checkout",
  AUTH: "/auth",
  ACCOUNT: "/minha-conta",
  ABOUT: "/sobre-nos",
  CONTACT: "/contato",
  SHIPPING: "/entrega",
  RETURNS: "/trocas-e-devolucoes",
  TERMS: "/termos-uso",
  PRIVACY: "/politica-privacidade",
  COOKIES: "/cookies",
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin",
    PRODUCTS: "/admin/produtos",
    PRODUCT_NEW: "/admin/produtos/novo",
    PRODUCT_EDIT: "/admin/produtos/editar",
    CATEGORIES: "/admin/categorias",
    CLIENTS: "/admin/clientes",
    ORDERS: "/admin/pedidos",
    SETTINGS: "/admin/configuracoes",
  },
} as const;

// ============================================================================
// STATUS E ESTADOS
// ============================================================================

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

// ============================================================================
// CONFIGURAÇÕES DE MÍDIA
// ============================================================================

export const MEDIA_CONFIG = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  DEFAULT_IMAGE_QUALITY: 0.8,
  THUMBNAIL_SIZE: 300,
  MEDIUM_SIZE: 600,
  LARGE_SIZE: 1200,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE BUSCA
// ============================================================================

export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 50,
  HIGHLIGHT_CLASS: "bg-yellow-200",
} as const;

// ============================================================================
// CONFIGURAÇÕES DE BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// ============================================================================
// CONFIGURAÇÕES DE ANIMAÇÃO
// ============================================================================

export const ANIMATION_CONFIG = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// ============================================================================
// MENSAGENS PADRÃO
// ============================================================================

export const MESSAGES = {
  ERRORS: {
    GENERIC: "Algo deu errado. Tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    UNAUTHORIZED: "Você não tem permissão para esta ação.",
    NOT_FOUND: "Item não encontrado.",
    VALIDATION: "Dados inválidos. Verifique os campos.",
    SERVER: "Erro interno do servidor.",
  },
  SUCCESS: {
    SAVED: "Salvo com sucesso!",
    DELETED: "Excluído com sucesso!",
    UPDATED: "Atualizado com sucesso!",
    CREATED: "Criado com sucesso!",
    SENT: "Enviado com sucesso!",
  },
  LOADING: {
    GENERIC: "Carregando...",
    SAVING: "Salvando...",
    DELETING: "Excluindo...",
    SENDING: "Enviando...",
    PROCESSING: "Processando...",
  },
} as const;

// ============================================================================
// CONFIGURAÇÕES DE SEO
// ============================================================================

export const SEO_CONFIG = {
  DEFAULT_TITLE: "Nova Casa Construção - Material de Construção Online",
  TITLE_SEPARATOR: " | ",
  DEFAULT_DESCRIPTION:
    "Loja completa de material de construção com os melhores preços. Cimento, tijolos, tintas, ferramentas e muito mais.",
  DEFAULT_KEYWORDS:
    "material de construção, cimento, tijolo, tinta, ferramentas, construção, obra, reforma",
  DEFAULT_AUTHOR: "Nova Casa Construção",
  DEFAULT_IMAGE: "/logo.png",
  TWITTER_HANDLE: "@novacasaconstrucao",
} as const;

// ============================================================================
// CONFIGURAÇÕES DE CONTATO
// ============================================================================

export const CONTACT_INFO = {
  PHONE: "(15) 99999-9999",
  EMAIL: "contato@novacasaconstrucao.com.br",
  ADDRESS: "Rua da Construção, 123 - Centro, Sorocaba - SP",
  WHATSAPP: "5515999999999",
  BUSINESS_HOURS: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
} as const;
