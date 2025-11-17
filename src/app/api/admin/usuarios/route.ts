import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().lean();
    return NextResponse.json({
      users,
      pagination: {
        page: 1,
        limit: users.length,
        total: users.length,
        totalPages: 1,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}
