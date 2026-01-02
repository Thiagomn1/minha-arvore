import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    const user = await UserService.getUserById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, payload } = body;
    const userId = session.user.id;

    let updatedUser;

    if (type === "dados") {
      updatedUser = await UserService.updateUserDados(userId, {
        nome: payload.nome,
        email: payload.email,
      });
    } else if (type === "endereco") {
      updatedUser = await UserService.updateUserEndereco(userId, {
        endereco: payload.endereco || {},
      });
    } else if (type === "senha") {
      updatedUser = await UserService.updateUserSenha(userId, {
        senhaAtual: payload.senhaAtual,
        novaSenha: payload.novaSenha,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Tipo inválido" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
