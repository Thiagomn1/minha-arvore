import type { OrderStatus } from "@/lib/constants";
import type { User } from "./user.types";

/**
 * Tipos relacionados a pedidos
 */

export interface OrderProduct {
  _id: string;
  name: string;
  imageUrl?: string;
  qty: number;
  price?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Order {
  _id: string;
  userId: string | User;
  orderId: string;
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
  location?: Location;
  mudaImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
