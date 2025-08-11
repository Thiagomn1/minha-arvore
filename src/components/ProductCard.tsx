import { Product } from "../types/ProductTypes";

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="h-40 bg-gray-100 mb-3 flex items-center justify-center">
        {product.image}
      </div>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <strong>R$ {product.price}</strong>
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:cursor-pointer"
          onClick={() => onAdd(product)}
        >
          Plantar
        </button>
      </div>
    </div>
  );
}
