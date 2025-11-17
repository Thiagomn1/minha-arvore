"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateCPF } from "@/lib/utils/cpfValidator";
import { validateCNPJ } from "@/lib/utils/cnpjValidator";
import { removeFormatting } from "@/lib/utils/formatters";
import { validatePassword } from "@/lib/validations/password";
import type { Address } from "@/components/registro/AddressSection";

interface FieldErrors {
  tipoPessoa?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  passwordMatch?: string;
  consentimento?: string;
}

interface FormData {
  tipoPessoa: "" | "PF" | "PJ";
  name: string;
  cpf: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: Address;
  password: string;
  confirmPassword: string;
  consentimentoLGPD: boolean;
}

const INITIAL_ADDRESS: Address = {
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
};

const INITIAL_FORM_DATA: FormData = {
  tipoPessoa: "",
  name: "",
  cpf: "",
  cnpj: "",
  email: "",
  telefone: "",
  endereco: INITIAL_ADDRESS,
  password: "",
  confirmPassword: "",
  consentimentoLGPD: false,
};

/**
 * Hook customizado para gerenciar lógica do formulário de registro
 */
export function useRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const isEmailValid = (value: string) => /\S+@\S+\.\S+/.test(value);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateEndereco = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [field]: value },
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrorMsg("");
    setFieldErrors({});
  };

  const validateForm = (): boolean => {
    setErrorMsg("");
    setFieldErrors({});

    if (!formData.tipoPessoa) {
      setFieldErrors({ tipoPessoa: "Selecione o tipo de pessoa" });
      return false;
    }

    if (formData.tipoPessoa === "PF" && !validateCPF(formData.cpf)) {
      setFieldErrors({ cpf: "CPF inválido" });
      return false;
    }

    if (formData.tipoPessoa === "PJ" && !validateCNPJ(formData.cnpj)) {
      setFieldErrors({ cnpj: "CNPJ inválido" });
      return false;
    }

    if (!isEmailValid(formData.email)) {
      setFieldErrors({ email: "Email inválido" });
      return false;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setFieldErrors({ passwordMatch: passwordError });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ passwordMatch: "As senhas não coincidem" });
      return false;
    }

    if (!formData.consentimentoLGPD) {
      setFieldErrors({ consentimento: "Você precisa aceitar a política de privacidade" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          tipoPessoa: formData.tipoPessoa,
          cpf: formData.tipoPessoa === "PF" ? removeFormatting(formData.cpf) : undefined,
          cnpj: formData.tipoPessoa === "PJ" ? removeFormatting(formData.cnpj) : undefined,
          email: formData.email,
          telefone: removeFormatting(formData.telefone),
          endereco: formData.endereco,
          password: formData.password,
          consentimentoLGPD: formData.consentimentoLGPD,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Erro ao criar conta");
      }

      setShowToast(true);
      resetForm();
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errorMsg,
    fieldErrors,
    loading,
    showToast,
    updateField,
    updateEndereco,
    handleSubmit,
  };
}
