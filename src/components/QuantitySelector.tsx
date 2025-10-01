"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Button from "./ui/Button";
import { Product } from "@/types/ProductTypes";
import AddToCartButton from "./AddToCartButton";

export default function QuantitySelector({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  const increaseQty = () => setQty((prev) => prev + 1);
  const decreaseQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Contador */}
      {product.status === "Disponível" && (
        <div className="flex items-center gap-2 border rounded-lg px-2 py-1 w-fit">
          <Button
            variant="ghost"
            onClick={decreaseQty}
            className="btn-xs"
            aria-label="Diminuir"
          >
            <MinusIcon className="w-4 h-4 text-gray-600" />
          </Button>

          <span className="font-medium text-gray-800">{qty}</span>

          <Button
            variant="ghost"
            onClick={increaseQty}
            className="btn-xs"
            aria-label="Aumentar"
          >
            <PlusIcon className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      )}

      {/* Usa o mesmo AddToCartButton do projeto */}
      <AddToCartButton product={product} quantity={qty} />
    </div>
  );
}
