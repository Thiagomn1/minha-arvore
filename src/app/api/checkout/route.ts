import { stripe } from "@/lib/stripe";
import Product from "@/models/Product";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { products } = body as {
    products: { productId: string; quantity: number }[];
  };

  await dbConnect();

  const dbProducts = await Product.find({
    _id: { $in: products.map((p) => p.productId) },
  });

  const lineItems = dbProducts.map((prod) => {
    const qty =
      products.find((p) => p.productId === prod._id.toString())?.quantity || 1;
    return { price: prod.stripePriceId, quantity: qty };
  });

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    metadata: {
      products: JSON.stringify(products), // guarda os produtos para criar a order depois
    },
  });

  return new NextResponse(JSON.stringify({ url: stripeSession.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
