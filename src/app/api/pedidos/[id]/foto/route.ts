import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Order from "@/models/Order";
import { withRateLimit } from "@/lib/with-rate-limit";
import { apiRateLimiter } from "@/lib/rate-limit";

async function handler(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();

  try {
    const order = await Order.findById(id);

    if (!order || !order.mudaImage) {
      return NextResponse.json(
        { message: "Foto não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ photoUrl: order.mudaImage });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Erro ao buscar foto" },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler, apiRateLimiter);
