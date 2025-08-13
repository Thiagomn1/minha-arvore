import { getServerSession } from "next-auth/next";
import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

type CheckoutProduct = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  const body = await req.json();
  const { products } = body as { products: CheckoutProduct[] };

  // Autenticação
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Não autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await dbConnect();

  if (!products?.length)
    return new Response(JSON.stringify({ error: "Nenhum produto enviado" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  const dbProducts = await Product.find({
    _id: { $in: products.map((p) => p.productId) },
  });

  const lineItems = dbProducts.map((prod) => {
    const qty =
      products.find((p) => p.productId === prod._id.toString())?.quantity || 1;
    return { price: prod.stripePriceId, quantity: qty };
  });

  const total = dbProducts.reduce((sum, prod) => {
    const qty =
      products.find((p) => p.productId === prod._id.toString())?.quantity || 1;
    return sum + prod.price * qty;
  }, 0);

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
  });

  const order = await Order.create({
    userId: session.user.id,
    products: products.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
    })),
    total,
    status: "pendente",
    stripeSessionId: stripeSession.id,
  });

  return new NextResponse(
    JSON.stringify({ url: stripeSession.url, orderId: order._id }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
