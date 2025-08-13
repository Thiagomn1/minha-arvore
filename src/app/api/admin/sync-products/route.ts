import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const stripeProducts = await stripe.products.list({ limit: 100 });

    for (const prod of stripeProducts.data) {
      const prices = await stripe.prices.list({ product: prod.id, limit: 1 });
      const price = prices.data[0];
      if (!price) continue;

      const category = (prod.metadata?.category || "Geral").toString().trim();

      // Debug
      console.log("Produto:", prod.name, "Categoria:", category);

      const existing = await Product.findOne({ stripePriceId: price.id });
      if (!existing) {
        await Product.create({
          name: prod.name,
          description: prod.description || "",
          price: price.unit_amount! / 100,
          stripePriceId: price.id,
          imageUrl: prod.images?.[0] || "",
          category: category,
        });
        console.log("Criado:", prod.name);
      }
    }

    return NextResponse.json({
      message: "Produtos sincronizados com sucesso!",
    });
    //eslint-disable-next-line
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
