import Image from "next/image";
import { Product } from "@/types/ProductTypes";
import Button from "./ui/Button";

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <div
      key={product.id}
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
        <h3 className="card-title text-black">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-lg font-bold text-green-600">R$ {product.price}</p>
        <div className="card-actions">
          <Button variant="success" onClick={() => onAdd(product)}>
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}
