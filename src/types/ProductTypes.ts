export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  qty?: number;
  category: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
}
