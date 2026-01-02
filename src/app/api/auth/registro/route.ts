import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { registerUserSchema } from "@/lib/validations/schemas";
import { handleApiError } from "@/lib/api-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dataToValidate = {
      ...body,
      aceitouTermos: body.consentimentoLGPD || body.aceitouTermos,
    };

    const validationResult = registerUserSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          message: "Verifique os campos e tente novamente",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await UserService.registerUser(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        message: "Usuário criado com sucesso",
        data: { userId: user._id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/auth/registro:", error);

    const errorMessage = handleApiError(error);
    const status = errorMessage.includes("já cadastrado") ? 409 : 500;

    return NextResponse.json(
      {
        error: "Erro ao criar usuário",
        message: errorMessage,
      },
      { status }
    );
  }
}
