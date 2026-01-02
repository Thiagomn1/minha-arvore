import { passwordSchema } from "./schemas";

export function validatePassword(password: string): string | null {
  const result = passwordSchema.safeParse(password);

  if (result.success) {
    return null;
  }

  return result.error.issues[0]?.message || "Senha inválida";
}

export function getPasswordRequirements(): string[] {
  return [
    "Mínimo de 6 caracteres",
    "Pelo menos uma letra maiúscula",
    "Pelo menos uma letra minúscula",
    "Pelo menos um número",
    "Pelo menos um caractere especial (@$!%*?&#)",
  ];
}
