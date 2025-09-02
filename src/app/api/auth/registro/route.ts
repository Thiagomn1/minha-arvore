import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      tipoPessoa,
      cpf,
      cnpj,
      email,
      telefone,
      endereco,
      password,
      consentimentoLGPD,
    } = body;

    if (!name || !tipoPessoa || !email || !telefone || !password) {
      return NextResponse.json(
        { message: "Campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    if (!consentimentoLGPD) {
      return NextResponse.json(
        { message: "É necessário aceitar a política de privacidade (LGPD)" },
        { status: 400 }
      );
    }

    if (tipoPessoa === "PF" && !cpf) {
      return NextResponse.json(
        { message: "CPF obrigatório para pessoa física" },
        { status: 400 }
      );
    }
    if (tipoPessoa === "PJ" && !cnpj) {
      return NextResponse.json(
        { message: "CNPJ obrigatório para pessoa jurídica" },
        { status: 400 }
      );
    }

    await dbConnect();

    const query: any[] = [{ email }];

    if (cpf) {
      query.push({ cpf });
    }
    if (cnpj) {
      query.push({ cnpj });
    }

    const existingUser = await User.findOne({ $or: query });

    if (existingUser) {
      return NextResponse.json(
        { message: "Usuário já cadastrado com esses dados" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      tipoPessoa,
      cpf: tipoPessoa === "PF" ? cpf : undefined,
      cnpj: tipoPessoa === "PJ" ? cnpj : undefined,
      email,
      telefone,
      endereco,
      password: hashedPassword,
      consentimentoLGPD,
    });

    return NextResponse.json(
      { message: "Usuário criado", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
