import dbConnect from "@/lib/db/mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      orders,
      pagination: {
        page: 1,
        limit: orders.length,
        total: orders.length,
        totalPages: 1,
      },
    }, { status: 200 });
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return NextResponse.json(
      { message: "Erro interno ao buscar pedidos." },
      { status: 500 }
    );
  }
}
