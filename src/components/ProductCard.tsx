import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/ProductTypes";
import Button from "./ui/Button";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  const increaseQty = () => setQty((prev) => prev + 1);
  const decreaseQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div
      key={product._id}
      className="card bg-base-100 shadow-xl border border-green-100 hover:shadow-2xl transition"
    >
      <figure className="px-4 pt-4">
        <Image
          src={product.imageUrl}
          width={800}
          height={800}
          alt={product.name}
          className="rounded-xl object-cover h-48 w-full"
        />
      </figure>
      <div className="card-body items-center text-center">
        <Link href={`/produtos/${product._id}`} passHref>
          <h3 className="card-title text-black hover:text-green-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 line-clamp-2 transition-all duration-300">
          {product.description}
        </p>
        <p className="text-lg font-bold text-green-600">R$ {product.price}</p>

        <div className="card-actions flex items-center gap-3">
          {/* Controle de quantidade */}
          <div className="flex items-center gap-1 border rounded-lg px-2 py-1 h-full">
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

          {/* Botão Doar */}
          <Button variant="success" onClick={() => onAdd(product, qty)}>
            Doar
          </Button>
        </div>
      </div>
    </div>
  );
}
