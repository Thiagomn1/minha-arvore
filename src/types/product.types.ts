import type { ProductStatus } from "@/lib/constants";

/**
 * Tipos relacionados a produtos
 */

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  qty?: number;
  category: string;
  imageUrl: string;
  status: ProductStatus;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  category: string;
  imageUrl: string;
  status: ProductStatus;
}
