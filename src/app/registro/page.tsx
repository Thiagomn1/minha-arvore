"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { FormCheckbox } from "@/components/forms/FormCheckbox";
import { PersonTypeSection } from "@/components/registro/PersonTypeSection";
import { AddressSection } from "@/components/registro/AddressSection";
import { PasswordSection } from "@/components/registro/PasswordSection";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";
import { formatTelefone } from "@/lib/utils/formatters";

/**
 * Página de registro de usuários
 * Refatorada em componentes menores e reutilizáveis
 */
export default function Register() {
  const {
    formData,
    errorMsg,
    fieldErrors,
    loading,
    showToast,
    updateField,
    updateEndereco,
    handleSubmit,
  } = useRegistrationForm();

  return (
    <main className="flex min-h-screen bg-base-200">
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Conta criada com sucesso! Redirecionando...</span>
          </div>
        </div>
      )}

      {/* Imagem lateral - apenas desktop */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-500">
        <Image
          src="/treelogin.svg"
          alt="Ilustração de árvore"
          width={1200}
          height={1200}
          priority
          className="max-w-[80%] h-auto drop-shadow-lg"
        />
      </div>

      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="card w-full max-w-md shadow-xl bg-base-100">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center text-primary">
              Criar Conta
            </h1>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Tipo de Pessoa (PF/PJ) + CPF/CNPJ */}
              <PersonTypeSection
                tipoPessoa={formData.tipoPessoa}
                cpf={formData.cpf}
                cnpj={formData.cnpj}
                onTipoPessoaChange={(value) => updateField("tipoPessoa", value)}
                onCpfChange={(value) => updateField("cpf", value)}
                onCnpjChange={(value) => updateField("cnpj", value)}
                errors={fieldErrors}
              />

              {/* Nome Completo */}
              <FormInput
                label="Nome Completo"
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nome completo ou razão social"
                required
              />

              {/* Email */}
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="seu@email.com"
                error={fieldErrors.email}
                required
              />

              {/* Telefone */}
              <FormInput
                label="Telefone"
                type="text"
                value={formData.telefone}
                onChange={(e) =>
                  updateField("telefone", formatTelefone(e.target.value))
                }
                maxLength={15}
                placeholder="(00) 00000-0000"
                required
              />

              {/* Endereço */}
              <AddressSection
                endereco={formData.endereco}
                onChange={updateEndereco}
              />

              {/* Senha e Confirmação */}
              <PasswordSection
                password={formData.password}
                confirmPassword={formData.confirmPassword}
                onPasswordChange={(value) => updateField("password", value)}
                onConfirmPasswordChange={(value) =>
                  updateField("confirmPassword", value)
                }
                error={fieldErrors.passwordMatch}
              />

              {/* Consentimento LGPD */}
              <FormCheckbox
                label={
                  <>
                    Eu li e aceito a{" "}
                    <a href="/politica-privacidade" className="link">
                      política de privacidade
                    </a>
                    .
                  </>
                }
                checked={formData.consentimentoLGPD}
                onChange={(e) => updateField("consentimentoLGPD", e.target.checked)}
                error={fieldErrors.consentimento}
              />

              {errorMsg && <p className="text-error text-sm">{errorMsg}</p>}

              {/* Botão de Submit */}
              <div className="form-control mt-6">
                <Button
                  type="submit"
                  variant="success"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Criar Conta"}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm mt-4">
              Já tem conta?{" "}
              <a href="/login" className="link link-primary">
                Entrar
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
