import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const products = await Product.find({ status: "Disponível" });

  const categories = Array.from(
    new Set(products.map((p) => p.category || "geral"))
  ).map((c, index) => ({ id: index.toString(), name: c }));

  return NextResponse.json({
    products: products.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category || "geral",
    })),
    categories,
  });
}
