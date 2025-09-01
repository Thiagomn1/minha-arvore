import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

async function generateUniqueOrderId() {
  let orderId = "";
  let exists = true;

  while (exists) {
    orderId = Math.floor(10000000 + Math.random() * 90000000).toString();

    const existing = await Order.exists({ orderId });
    exists = !!existing;
  }

  return orderId;
}

async function createOrder(
  userId: string,
  products: { productId: string; quantity: number }[],
  total: number,
  location: { latitude: number; longitude: number }
) {
  const orderId = await generateUniqueOrderId();

  const dbProducts = await Product.find({
    _id: { $in: products.map((p) => p.productId) },
  });

  const orderProducts = products.map((p) => {
    const prod = dbProducts.find((db) => db._id.toString() === p.productId);
    if (!prod) throw new Error("Produto não encontrado");
    return {
      productId: prod._id,
      name: prod.name,
      imageUrl: prod.imageUrl,
      quantity: p.quantity,
    };
  });

  const newOrder = await Order.create({
    userId,
    products: orderProducts,
    total,
    location,
    status: "Pendente",
    orderId,
  });

  return newOrder;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { products, userId, location } = body as {
      products: any[];
      userId: string;
      location: { latitude: number; longitude: number };
    };

    await dbConnect();

    const dbProducts = await Product.find({
      _id: { $in: products.map((p) => p.productId) },
    });

    if (dbProducts.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Produtos não encontrados" }),
        { status: 400 }
      );
    }

    const total = dbProducts.reduce((acc, prod) => {
      const qty =
        products.find((p) => p.productId === prod._id.toString())?.quantity ||
        1;
      return acc + prod.price * qty;
    }, 0);

    // Criar a ordem no MongoDB
    const newOrder = createOrder(userId, products, total, location);

    return new NextResponse(JSON.stringify(newOrder), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
    //eslint-disable-next-line
  } catch (err: any) {
    console.error("Erro ao criar ordem:", err);
    return new NextResponse(JSON.stringify({ error: "Erro ao criar ordem" }), {
      status: 500,
    });
  }
}
