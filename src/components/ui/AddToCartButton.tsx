"use client";
import { Product } from "@/types/ProductTypes";
import Button from "./Button";
import { useCart } from "@/context/useCart";

export default function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((state) => state.add); // exemplo usando Zustand
  const onAdd = () => {
    add({
      _id: product._id,
      name: product.name,
      price: product.price,
      qty: 1,
      image: product.imageUrl,
    });
  };

  return (
    <Button variant="success" className="w-full md:w-1/2" onClick={onAdd}>
      Adicionar ao Carrinho
    </Button>
  );
}
