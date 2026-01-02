import dbConnect from "@/lib/db/mongoose";
import Product from "@/models/Product";
import { ERROR_MESSAGES, PRODUCT_STATUS } from "@/lib/constants";
import type {
  ProductInput,
  UpdateProductInput,
} from "@/lib/validations/schemas";

export class ProductService {
  static async getAllProducts(
    options: {
      page?: number;
      limit?: number;
      category?: string;
      status?: string;
    } = {}
  ) {
    await dbConnect();

    const { page = 1, limit = 10, category, status } = options;
    const skip = (page - 1) * limit;

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

  static async getProductById(productId: string) {
    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  static async createProduct(data: ProductInput) {
    await dbConnect();

    const product = await Product.create(data);
    return product;
  }

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

  static async deleteProduct(productId: string) {
    await dbConnect();

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw new Error(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  static async getProductsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ) {
    return this.getAllProducts({ page, limit, category });
  }

  static async getAvailableProducts(page: number = 1, limit: number = 10) {
    return this.getAllProducts({
      page,
      limit,
      status: PRODUCT_STATUS.AVAILABLE,
    });
  }
}
