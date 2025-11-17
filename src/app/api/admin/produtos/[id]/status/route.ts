import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Product from "@/models/Product";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const { status } = await req.json();

    if (!["Disponível", "Indisponível"].includes(status)) {
      return NextResponse.json({ message: "Status inválido" }, { status: 400 });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}
