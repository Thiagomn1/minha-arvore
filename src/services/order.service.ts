import dbConnect from "@/lib/db/mongoose";
import Order from "@/models/Order";
import { ERROR_MESSAGES, ORDER_STATUS } from "@/lib/constants";
import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "@/lib/validations/schemas";

export class OrderService {
  static async createOrder(userId: string, data: CreateOrderInput) {
    await dbConnect();

    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

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

  static async getOrderById(orderId: string) {
    await dbConnect();

    const order = await Order.findById(orderId).populate(
      "userId",
      "name email"
    );
    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order;
  }

  static async getUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    await dbConnect();

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
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

  static async getAllOrders(
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ) {
    await dbConnect();

    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

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

  static async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusInput
  ) {
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

  static async getOrderImage(orderId: string) {
    await dbConnect();

    const order = await Order.findById(orderId).select("mudaImage");
    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order.mudaImage;
  }

  static async deleteOrder(orderId: string) {
    await dbConnect();

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return order;
  }
}
