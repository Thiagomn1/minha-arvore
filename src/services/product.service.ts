/**
 * Serviço de Produto - Lógica de negócio relacionada a produtos
 */
import dbConnect from "@/lib/db/mongoose";
import Product from "@/models/Product";
import { ERROR_MESSAGES, PRODUCT_STATUS } from "@/lib/constants";
import type { ProductInput, UpdateProductInput } from "@/lib/validations/schemas";

export class ProductService {
  /**
   * Lista todos os produtos com paginação e filtros
   */
  static async getAllProducts(options: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
  } = {}) {
    await dbConnect();

    const { page = 1, limit = 10, category, status } = options;
    const skip = (page - 1) * limit;

    // Construir query de filtros
    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca produto por ID
   */
  static async getProductById(productId: string) {
    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  /**
   * Cria um novo produto (Admin)
   */
  static async createProduct(data: ProductInput) {
    await dbConnect();

    const product = await Product.create(data);
    return product;
  }

  /**
   * Atualiza um produto (Admin)
   */
  static async updateProduct(productId: string, data: UpdateProductInput) {
    await dbConnect();

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  /**
   * Altera o status de um produto (Admin)
   */
  static async updateProductStatus(productId: string, status: string) {
    await dbConnect();

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { status } },
      { new: true }
    );

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  /**
   * Deleta um produto (Admin)
   */
  static async deleteProduct(productId: string) {
    await dbConnect();

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  /**
   * Busca produtos por categoria
   */
  static async getProductsByCategory(category: string, page: number = 1, limit: number = 10) {
    return this.getAllProducts({ page, limit, category });
  }

  /**
   * Busca apenas produtos disponíveis
   */
  static async getAvailableProducts(page: number = 1, limit: number = 10) {
    return this.getAllProducts({ page, limit, status: PRODUCT_STATUS.AVAILABLE });
  }
}
