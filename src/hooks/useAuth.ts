import { useMutation } from "@tanstack/react-query";

interface RegisterData {
  name: string;
  tipoPessoa: "PF" | "PJ";
  cpf?: string;
  cnpj?: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  password: string;
  consentimentoLGPD: boolean;
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Erro ao criar conta");
      }

      return result;
    },
  });
}
