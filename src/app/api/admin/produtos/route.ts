import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const deleted = await Product.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Produto deletado com sucesso" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}
