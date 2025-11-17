import { NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";
import { paginationSchema } from "@/lib/validations/schemas";
import { handleApiError } from "@/lib/api-client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const paginationData = paginationSchema.safeParse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    });

    if (!paginationData.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", details: paginationData.error },
        { status: 400 }
      );
    }

    const { page, limit } = paginationData.data;
    const category = searchParams.get("category") || undefined;

    const result = await ProductService.getAvailableProducts(page, limit);

    let products = result.products;
    if (category) {
      products = products.filter((p) => p.category === category);
    }

    const categories = Array.from(
      new Set(products.map((p) => p.category || "geral"))
    ).map((c, index) => ({ id: index.toString(), name: c }));

    return NextResponse.json({
      products: products.map((p) => ({
        _id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        category: p.category || "Geral",
        status: p.status,
      })),
      categories,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in GET /api/produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos", message: handleApiError(error) },
      { status: 500 }
    );
  }
}
