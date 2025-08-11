import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { cart, location } = req.body;
  // mock processing
  const orderId = "ORD-" + Date.now();
  // In a real app, create order in DB + call payment gateway
  return NextResponse.json({ ok: true, orderId });
}
