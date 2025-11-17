"use client";
import { Product } from "@/types";
import Button from "./ui/Button";
import { useCart } from "@/context/useCart";

export default function AddToCartButton({
  product,
  quantity,
}: {
  product: Product;
  quantity: number;
}) {
  const add = useCart((state) => state.add); // exemplo usando Zustand
  const onAdd = () => {
    add({
      _id: product._id,
      name: product.name,
      price: product.price,
      qty: quantity || 1,
      image: product.imageUrl,
    });
  };

  return (
    <Button variant="success" className="w-full md:w-1/2" onClick={onAdd}>
      Doar
    </Button>
  );
}
