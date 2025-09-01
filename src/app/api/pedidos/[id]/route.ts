import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = await params;

    const orders = await Order.find({ userId: id })
      .populate({
        path: "products.productId",
        select: "name imageUrl", // não precisa do model se o ref está correto
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "Nenhum pedido encontrado para este usuário." },
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar pedidos." },
      { status: 500 }
    );
  }
}
