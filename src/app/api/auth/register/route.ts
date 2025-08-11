import bcrypt from "bcrypt";
import dbConnect from "../../../../lib/mongoose";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, cpf, email, password } = body;

    if (!name || !cpf || !email || !password) {
      return NextResponse.json({ message: "Campos em falta" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({
      $or: [{ email }, { cpf }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Usuário com esse email ou CPF já existe" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      cpf,
      email,
      password: hashedPassword,
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
