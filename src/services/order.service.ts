/**
 * Serviço de Pedido - Lógica de negócio relacionada a pedidos
 */
import dbConnect from "@/lib/db/mongoose";
import Order from "@/models/Order";
import { ERROR_MESSAGES, ORDER_STATUS } from "@/lib/constants";
import type { CreateOrderInput, UpdateOrderStatusInput } from "@/lib/validations/schemas";

export class OrderService {
  /**
   * Cria um novo pedido
   */
  static async createOrder(userId: string, data: CreateOrderInput) {
    await dbConnect();

    // Gera um ID único para o pedido
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const order = await Order.create({
      userId,
      orderId,
      products: data.products,
      total: data.total,
      location: data.location,
      status: ORDER_STATUS.PENDING,
    });

    return order;
  }

  /**
   * Busca pedido por ID
   */
  static async getOrderById(orderId: string) {
    await dbConnect();

    const order = await Order.findById(orderId).populate("userId", "name email");
    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order;
  }

  /**
   * Lista pedidos de um usuário
   */
  static async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    await dbConnect();

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments({ userId }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lista todos os pedidos (Admin)
   */
  static async getAllOrders(options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) {
    await dbConnect();

    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    // Construir query de filtros
    const query: any = {};
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("userId", "name email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Atualiza o status de um pedido (Admin)
   */
  static async updateOrderStatus(orderId: string, data: UpdateOrderStatusInput) {
    await dbConnect();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status: data.status } },
      { new: true }
    ).populate("userId", "name email");

    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order;
  }

  /**
   * Faz upload da imagem da muda plantada (Admin)
   */
  static async uploadOrderImage(orderId: string, imageUrl: string) {
    await dbConnect();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: { mudaImage: imageUrl } },
      { new: true }
    );

    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order;
  }

  /**
   * Busca a foto de um pedido
   */
  static async getOrderImage(orderId: string) {
    await dbConnect();

    const order = await Order.findById(orderId).select("mudaImage");
    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order.mudaImage;
  }

  /**
   * Deleta um pedido (Admin)
   */
  static async deleteOrder(orderId: string) {
    await dbConnect();

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order;
  }
}
