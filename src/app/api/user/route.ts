import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { updateUser } from "@/lib/updateUser";

export async function PUT(req: NextRequest) {
  try {
    // pega a sessão do usuário logado
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, payload } = body;

    // userId do usuário logado
    const userId = session.user.id;
    console.log(body);
    const updatedUser = await updateUser(userId, type, payload);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
