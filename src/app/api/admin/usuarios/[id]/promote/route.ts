import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
