import { NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";
import { productSchema, paginationSchema } from "@/lib/validations/schemas";
import { handleApiError } from "@/lib/api-client";

/**
 * GET /api/admin/produtos
 * Lista todos os produtos (com paginação) - Admin apenas
 * Middleware já valida autenticação e role
 */
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
    const result = await ProductService.getAllProducts({ page, limit });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/admin/produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos", message: handleApiError(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/produtos
 * Cria um novo produto - Admin apenas
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = productSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const product = await ProductService.createProduct(validationResult.data);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/produtos:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto", message: handleApiError(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/produtos?id=xxx
 * Deleta um produto - Admin apenas
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
        { status: 400 }
      );
    }

    await ProductService.deleteProduct(productId);

    return NextResponse.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Error in DELETE /api/admin/produtos:", error);

    const message = handleApiError(error);
    const status = message.includes("não encontrado") ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
