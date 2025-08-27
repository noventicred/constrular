import { prisma } from "./db";
import { Prisma } from "@prisma/client";

// Tipos para produtos
export type Product = Prisma.ProductGetPayload<{
  include: { categoryRelation: true };
}>;

export type Category = Prisma.CategoryGetPayload<{
  include: { children: true; parent: true };
}>;

export type Order = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } }; user: true };
}>;

// Serviço de Produtos
export class ProductService {
  static async getAllProducts() {
    return prisma.product.findMany({
      include: {
        categoryRelation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        categoryRelation: true,
      },
    });
  }

  static async getFeaturedProducts() {
    return prisma.product.findMany({
      where: { isFeatured: true, inStock: true },
      include: {
        categoryRelation: true,
      },
      take: 8,
    });
  }

  static async getSpecialOffers() {
    return prisma.product.findMany({
      where: { isSpecialOffer: true, inStock: true },
      include: {
        categoryRelation: true,
      },
      take: 6,
    });
  }

  static async searchProducts(
    searchTerm: string,
    filters?: {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    }
  ) {
    const where: Prisma.ProductWhereInput = {
      AND: [
        searchTerm
          ? {
              OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
                { brand: { contains: searchTerm, mode: "insensitive" } },
              ],
            }
          : {},
        filters?.categoryId ? { categoryId: filters.categoryId } : {},
        filters?.minPrice ? { price: { gte: filters.minPrice } } : {},
        filters?.maxPrice ? { price: { lte: filters.maxPrice } } : {},
        filters?.inStock !== undefined ? { inStock: filters.inStock } : {},
      ],
    };

    return prisma.product.findMany({
      where,
      include: {
        categoryRelation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async createProduct(data: Omit<Prisma.ProductCreateInput, "id">) {
    return prisma.product.create({
      data,
      include: {
        categoryRelation: true,
      },
    });
  }

  static async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        categoryRelation: true,
      },
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

// Serviço de Categorias
export class CategoryService {
  static async getAllCategories() {
    return prisma.category.findMany({
      include: {
        children: true,
        parent: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  static async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        products: true,
      },
    });
  }

  static async createCategory(data: Omit<Prisma.CategoryCreateInput, "id">) {
    return prisma.category.create({
      data,
      include: {
        children: true,
        parent: true,
      },
    });
  }

  static async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        children: true,
        parent: true,
      },
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

// Serviço de Pedidos
export class OrderService {
  static async createOrder(
    userId: string,
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>,
    shippingCost: number = 0
  ) {
    const totalAmount =
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      shippingCost;

    return prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingCost,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  static async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAllOrders() {
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  static async updateOrderStatus(
    id: string,
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
  ) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }
}

// Serviço de Estatísticas
export class StatsService {
  static async getDashboardStats() {
    const [
      totalProducts,
      totalCategories,
      totalUsers,
      activeProducts,
      totalOrders,
      pendingOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.product.count({ where: { inStock: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);

    // Receita do mês atual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: { not: "CANCELLED" },
      },
      select: { totalAmount: true },
    });

    const monthlyRevenue = monthlyOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    return {
      totalProducts,
      totalCategories,
      totalUsers,
      activeProducts,
      totalOrders,
      pendingOrders,
      monthlyRevenue,
    };
  }
}
