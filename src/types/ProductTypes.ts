export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  qty?: number;
  category: string;
  image: any;
}

export interface Category {
  id: string;
  name: string;
}
