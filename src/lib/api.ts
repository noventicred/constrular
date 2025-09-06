// ============================================================================
// API CLIENT - NOVA CASA CONSTRUÇÃO
// ============================================================================
// Cliente API centralizado com tratamento de erros e tipagem
// ============================================================================

import { supabase } from "@/integrations/supabase/client";
import {
  Product,
  Category,
  Order,
  OrderItem,
  UserProfile,
  ApiResponse,
  PaginatedResponse,
  SearchFilters,
} from "@/types";
import { logger, apiLogger } from "@/lib/logger";
import { PAGINATION } from "@/lib/constants";

// ============================================================================
// TIPOS ESPECÍFICOS DA API
// ============================================================================

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  discount?: number;
  image_url?: string;
  category_id: string;
  in_stock: boolean;
  is_featured: boolean;
  is_special_offer: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

export interface CreateOrderData {
  user_id: string;
  total_amount: number;
  payment_method?: string;
  shipping_address?: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

// ============================================================================
// CLIENTE API BASE
// ============================================================================

class ApiClient {
  private handleError<T>(error: any, operation: string): ApiResponse<T> {
    apiLogger.error(`API Error in ${operation}:`, error);

    return {
      success: false,
      error: {
        message: error.message || "Erro inesperado",
        code: error.code || "UNKNOWN_ERROR",
      },
    };
  }

  private handleSuccess<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }

  // ============================================================================
  // PRODUTOS
  // ============================================================================

  async getProducts(
    filters: SearchFilters = {},
    page = 1,
    limit = PAGINATION.DEFAULT_LIMIT
  ): Promise<PaginatedResponse<Product>> {
    try {
      let query = supabase.from("products").select(`
          *,
          category:categories(*)
        `);

      // Aplicar filtros
      if (filters.category) {
        query = query.eq("category_id", filters.category);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters.inStock !== undefined) {
        query = query.eq("in_stock", filters.inStock);
      }
      if (filters.featured !== undefined) {
        query = query.eq("is_featured", filters.featured);
      }
      if (filters.onSale !== undefined) {
        query = query.eq("is_special_offer", filters.onSale);
      }

      // Aplicar ordenação
      switch (filters.sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        default:
          query = query.order("name", { ascending: true });
      }

      // Aplicar paginação
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return this.handleError(error, "getProducts");
      }

      const totalPages = count ? Math.ceil(count / limit) : 1;

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    } catch (error) {
      return this.handleError(error, "getProducts");
    }
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        return this.handleError(error, "getProduct");
      }

      return this.handleSuccess(data);
    } catch (error) {
      return this.handleError(error, "getProduct");
    }
  }

  async createProduct(
    productData: CreateProductData
  ): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, "createProduct");
      }

      return this.handleSuccess(data);
    } catch (error) {
      return this.handleError(error, "createProduct");
    }
  }

  async updateProduct(
    productData: UpdateProductData
  ): Promise<ApiResponse<Product>> {
    try {
      const { id, ...updateData } = productData;

      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return this.handleError(error, "updateProduct");
      }

      return this.handleSuccess(data);
    } catch (error) {
      return this.handleError(error, "updateProduct");
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        return this.handleError(error, "deleteProduct");
      }

      return this.handleSuccess(undefined);
    } catch (error) {
      return this.handleError(error, "deleteProduct");
    }
  }

  // ============================================================================
  // CATEGORIAS
  // ============================================================================

  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        return this.handleError(error, "getCategories");
      }

      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, "getCategories");
    }
  }

  async getCategory(id: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return this.handleError(error, "getCategory");
      }

      return this.handleSuccess(data);
    } catch (error) {
      return this.handleError(error, "getCategory");
    }
  }

  async createCategory(
    categoryData: CreateCategoryData
  ): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert(categoryData)
        .select()
        .single();

      if (error) {
        return this.handleError(error, "createCategory");
      }

      return this.handleSuccess(data);
    } catch (error) {
      return this.handleError(error, "createCategory");
    }
  }

  async updateCategory(
    categoryData: UpdateCategoryData
  ): Promise<ApiResponse<Category>> {
    try {
      const { id, ...updateData } = categoryData;

      const { data, error } = await supabase
        .from("categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return this.handleError(error, "updateCategory");
      }

      return this.handleSuccess(data);
    } catch (error) {
      return this.handleError(error, "updateCategory");
    }
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) {
        return this.handleError(error, "deleteCategory");
      }

      return this.handleSuccess(undefined);
    } catch (error) {
      return this.handleError(error, "deleteCategory");
    }
  }

  // ============================================================================
  // PEDIDOS
  // ============================================================================

  async createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
    try {
      // Iniciar transação
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: orderData.user_id,
          total_amount: orderData.total_amount,
          payment_method: orderData.payment_method,
          shipping_address: orderData.shipping_address,
        })
        .select()
        .single();

      if (orderError) {
        return this.handleError(orderError, "createOrder");
      }

      // Criar itens do pedido
      const orderItems = orderData.items.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        // Rollback: deletar o pedido se falhar ao criar itens
        await supabase.from("orders").delete().eq("id", order.id);
        return this.handleError(itemsError, "createOrder");
      }

      return this.handleSuccess(order);
    } catch (error) {
      return this.handleError(error, "createOrder");
    }
  }

  async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items(*)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return this.handleError(error, "getUserOrders");
      }

      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, "getUserOrders");
    }
  }

  // ============================================================================
  // PERFIL DO USUÁRIO
  // ============================================================================

  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase.rpc("get_user_complete_profile", {
        target_user_id: userId,
      });

      if (error) {
        return this.handleError(error, "getUserProfile");
      }

      if (!data || data.length === 0) {
        return this.handleError(
          { message: "Perfil não encontrado", code: "PROFILE_NOT_FOUND" },
          "getUserProfile"
        );
      }

      return this.handleSuccess(data[0]);
    } catch (error) {
      return this.handleError(error, "getUserProfile");
    }
  }

  async updateUserProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return this.handleError(error, "updateUserProfile");
      }

      return this.handleSuccess(data);
    } catch (error) {
      return this.handleError(error, "updateUserProfile");
    }
  }
}

// Instância singleton do cliente API
export const apiClient = new ApiClient();

// Exportar métodos específicos para facilitar o uso
export const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createOrder,
  getUserOrders,
  getUserProfile,
  updateUserProfile,
} = apiClient;

export default apiClient;
