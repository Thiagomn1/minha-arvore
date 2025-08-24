import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    user.role = "Admin";
    await user.save();

    return NextResponse.json(
      { message: "Usuário promovido para Admin" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao promover usuário:", error);
    return NextResponse.json(
      { error: "Erro ao promover usuário" },
      { status: 500 }
    );
  }
}
