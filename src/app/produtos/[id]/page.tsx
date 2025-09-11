import Image from "next/image";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import ProductModel from "@/models/Product";
import { Product } from "@/types/ProductTypes";
import QuantitySelector from "@/components/ui/QuantitySelector";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  await dbConnect();

  function toPlainProduct(doc: any): Product {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      price: doc.price,
      category: doc.category,
      imageUrl: doc.imageUrl,
      status: doc.status,
    };
  }

  const productDoc = await ProductModel.findById(id).lean();
  if (!productDoc) notFound();

  const product = toPlainProduct(productDoc);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-2xl shadow-lg object-cover w-full max-w-lg"
          />
        </div>

        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-green-600">
            R$ {product.price}
          </p>

          <QuantitySelector product={product} />

          <div className="divider"></div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Categoria</h2>
            <span className="badge badge-outline">{product.category}</span>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Disponibilidade</h2>
            <span
              className={`badge ${
                product.status === "Disponível"
                  ? "badge-success"
                  : "badge-error"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>
      </div>

      <span className="divider mt-12"></span>
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Descrição</h2>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
}
