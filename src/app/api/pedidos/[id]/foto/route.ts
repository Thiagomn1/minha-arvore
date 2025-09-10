import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  await dbConnect();

  try {
    const order = await Order.findById(id);

    if (!order || !order.mudaImage) {
      return NextResponse.json(
        { message: "Foto não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ photoUrl: order.mudaImage });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao buscar foto" },
      { status: 500 }
    );
  }
}
