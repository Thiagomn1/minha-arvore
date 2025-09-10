import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const formData = await req.formData();
    const file = formData.get("mudaImage") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Nenhuma imagem enviada." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = `data:${file.type};base64,${Buffer.from(
      arrayBuffer
    ).toString("base64")}`;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { mudaImage: base64Image, status: "Plantado" },
      { new: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Pedido não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao enviar imagem." },
      { status: 500 }
    );
  }
}
