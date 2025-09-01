import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Buscar todos os pedidos, populando os produtos
    const orders = await Order.find()
      .populate({
        path: "products.productId",
        select: "name imageUrl", // pega nome e imagem
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "Nenhum pedido encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return NextResponse.json(
      { message: "Erro interno ao buscar pedidos." },
      { status: 500 }
    );
  }
}
