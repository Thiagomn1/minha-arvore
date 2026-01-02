import { NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { ProductService } from "@/services/product.service";
import { createOrderSchema } from "@/lib/validations/schemas";
import { handleApiError } from "@/lib/api-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { products, userId, location } = body;

    const orderData = {
      products,
      total: 0,
      location: location
        ? {
            lat: location.latitude || location.lat,
            lng: location.longitude || location.lng,
          }
        : undefined,
    };

    const productIds = products.map((p: any) => p._id || p.productId);
    const dbProductsPromises = productIds.map((id: string) =>
      ProductService.getProductById(id)
    );
    const dbProducts = await Promise.all(dbProductsPromises);

    if (dbProducts.length === 0) {
      return NextResponse.json(
        { error: "Produtos não encontrados" },
        { status: 400 }
      );
    }

    let total = 0;
    const orderProducts = products.map((p: any) => {
      const product = dbProducts.find(
        (db) => db._id.toString() === (p._id || p.productId)
      );
      if (!product) {
        throw new Error(`Produto ${p._id || p.productId} não encontrado`);
      }

      const quantity = p.qty || p.quantity || 1;
      const price = product.price;
      total += price * quantity;

      return {
        productId: product._id.toString(),
        quantity,
        price,
      };
    });

    orderData.products = orderProducts;
    orderData.total = total;

    const validationResult = createOrderSchema.safeParse(orderData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newOrder = await OrderService.createOrder(
      userId,
      validationResult.data
    );

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/checkout:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido", message: handleApiError(error) },
      { status: 500 }
    );
  }
}
