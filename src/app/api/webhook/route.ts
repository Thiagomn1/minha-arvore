import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // importante para receber raw body
  },
};

async function getRawBody(req: NextApiRequest) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("Missing Stripe signature");

  const buf = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const products = JSON.parse(session.metadata?.products || "[]");

    try {
      await Order.create({
        userId: session.customer_email || "Desconhecido",
        products,
        total: (session.amount_total ?? 0) / 100,
        status: "Em Processo",
        stripeSessionId: session.id,
      });
      console.log("Pedido criado com sucesso via webhook:", session.id);
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      return res.status(500).send("Erro ao criar pedido");
    }
  }

  return res.status(200).json({ received: true });
}
