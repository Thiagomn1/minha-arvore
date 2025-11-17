import { NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { paginationSchema } from "@/lib/validations/schemas";
import { handleApiError } from "@/lib/api-client";

/**
 * GET /api/pedidos/[id]
 * Busca pedidos de um usuário
 * [id] = userId
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

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
    const result = await OrderService.getUserOrders(userId, page, limit);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/pedidos/[id]:", error);

    const message = handleApiError(error);
    const status = message.includes("não encontrado") ? 404 : 500;

    return NextResponse.json(
      { error: "Erro ao buscar pedidos", message },
      { status }
    );
  }
}
