// ============================================================================
// TIPOS CENTRALIZADOS - NOVA CASA CONSTRUÇÃO
// ============================================================================
// Este arquivo centraliza todos os tipos compartilhados do projeto
// ============================================================================

export * from "./auth";

// ============================================================================
// TIPOS DE PRODUTOS E CATEGORIAS
// ============================================================================

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price?: number | null;
  discount?: number;
  image_url: string | null;
  category_id: string | null;
  in_stock: boolean;
  rating: number;
  reviews: number;
  is_featured: boolean;
  is_special_offer: boolean;
  created_at: string;
  updated_at?: string;
  category?: Category;
}

export interface ProductComment {
  id: string;
  product_id: string;
  author_name: string;
  comment_text: string;
  rating: number;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// TIPOS DE CARRINHO E PEDIDOS
// ============================================================================

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  in_stock: boolean;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_method: string | null;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// ============================================================================
// TIPOS DE FORMULÁRIOS
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount?: number;
  image_url?: string;
  category_id: string;
  in_stock: boolean;
  is_featured: boolean;
  is_special_offer: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
}

// ============================================================================
// TIPOS DE CONFIGURAÇÕES
// ============================================================================

export interface Settings {
  whatsapp_number: string;
  store_name: string;
  store_email: string;
  free_shipping_threshold: string;
  default_shipping_cost: string;
}

// ============================================================================
// TIPOS DE BUSCA E FILTROS
// ============================================================================

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  sortBy?: "name" | "price_asc" | "price_desc" | "rating" | "newest";
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// TIPOS DE RESPOSTA DA API
// ============================================================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// TIPOS DE COMPONENTES UI
// ============================================================================

export interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

// ============================================================================
// TIPOS DE EVENTOS
// ============================================================================

export interface CustomEvent<T = any> {
  type: string;
  data?: T;
  timestamp: Date;
}

export interface AnalyticsEvent extends CustomEvent {
  userId?: string;
  sessionId: string;
  page: string;
}

// ============================================================================
// TIPOS UTILITÁRIOS
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Status = "idle" | "loading" | "success" | "error";
export type Theme = "light" | "dark" | "system";
