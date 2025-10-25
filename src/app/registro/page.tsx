"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validateCPF } from "@/lib/cpfValidator";
import { validateCNPJ } from "@/lib/cnpjValidator";
import Button from "@/components/ui/Button";
import { SelectEstado } from "@/components/ui/SelectEstado";
import { SelectCidade } from "@/components/ui/SelectCidade";

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface FieldErrors {
  tipoPessoa?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  passwordMatch?: string;
  consentimento?: string;
}

export default function Register() {
  const router = useRouter();

  const [tipoPessoa, setTipoPessoa] = useState<"" | "PF" | "PJ">("");
  const [name, setName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [endereco, setEndereco] = useState<Endereco>({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [consentimentoLGPD, setConsentimentoLGPD] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const isEmailValid = (value: string) => /\S+@\S+\.\S+/.test(value);

  const formatCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const formatCNPJ = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");

  const formatTelefone = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");

  const handleEnderecoChange = (field: keyof Endereco, value: string) => {
    setEndereco((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres";
    if (!/[A-Z]/.test(password))
      return "A senha deve conter pelo menos uma letra maiúscula";
    if (!/[a-z]/.test(password))
      return "A senha deve conter pelo menos uma letra minúscula";
    if (!/[0-9]/.test(password))
      return "A senha deve conter pelo menos um número";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      return "A senha deve conter pelo menos um caractere especial";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    if (!tipoPessoa) {
      setFieldErrors((s) => ({
        ...s,
        tipoPessoa: "Selecione o tipo de pessoa",
      }));
      return;
    }

    if (tipoPessoa === "PF" && !validateCPF(cpf)) {
      setFieldErrors((s) => ({ ...s, cpf: "CPF inválido" }));
      return;
    }

    if (tipoPessoa === "PJ" && !validateCNPJ(cnpj)) {
      setFieldErrors((s) => ({ ...s, cnpj: "CNPJ inválido" }));
      return;
    }

    if (!isEmailValid(email)) {
      setFieldErrors((s) => ({ ...s, email: "Email inválido" }));
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFieldErrors((s) => ({ ...s, passwordMatch: passwordError }));
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors((s) => ({
        ...s,
        passwordMatch: "As senhas não coincidem",
      }));
      return;
    }

    if (!consentimentoLGPD) {
      setFieldErrors((s) => ({
        ...s,
        consentimento: "Você precisa aceitar a política de privacidade",
      }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          tipoPessoa,
          cpf: tipoPessoa === "PF" ? cpf.replace(/\D/g, "") : undefined,
          cnpj: tipoPessoa === "PJ" ? cnpj.replace(/\D/g, "") : undefined,
          email,
          telefone: telefone.replace(/\D/g, ""),
          endereco,
          password,
          consentimentoLGPD,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Erro ao criar conta");
      }

      setShowToast(true);
      setName("");
      setCpf("");
      setCnpj("");
      setEmail("");
      setTelefone("");
      setEndereco({
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      });
      setPassword("");
      setConfirmPassword("");
      setTipoPessoa("");
      setConsentimentoLGPD(false);

      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-base-200">
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Conta criada com sucesso! Redirecionando...</span>
          </div>
        </div>
      )}

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

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="card w-full max-w-md shadow-xl bg-base-100">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center text-primary">
              Criar Conta
            </h1>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Tipo de pessoa */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Tipo de Pessoa
                  </span>
                </label>
                <select
                  value={tipoPessoa}
                  onChange={(e) =>
                    setTipoPessoa(e.target.value as "" | "PF" | "PJ")
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
                {fieldErrors.tipoPessoa && (
                  <p className="text-error text-sm">{fieldErrors.tipoPessoa}</p>
                )}
              </div>

              {/* CPF ou CNPJ */}
              {tipoPessoa === "PF" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">CPF</span>
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    maxLength={14}
                    className="input input-bordered w-full"
                    placeholder="000.000.000-00"
                    required
                  />
                  {fieldErrors.cpf && (
                    <p className="text-error text-sm">{fieldErrors.cpf}</p>
                  )}
                </div>
              )}
              {tipoPessoa === "PJ" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">CNPJ</span>
                  </label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                    maxLength={18}
                    className="input input-bordered w-full"
                    placeholder="00.000.000/0000-00"
                    required
                  />
                  {fieldErrors.cnpj && (
                    <p className="text-error text-sm">{fieldErrors.cnpj}</p>
                  )}
                </div>
              )}

              {/* Nome */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Nome Completo
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input input-bordered w-full"
                  placeholder="Nome completo ou razão social"
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-bordered w-full"
                  placeholder="seu@email.com"
                />
                {fieldErrors.email && (
                  <p className="text-error text-sm">{fieldErrors.email}</p>
                )}
              </div>

              {/* Telefone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Telefone</span>
                </label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                  maxLength={15}
                  required
                  className="input input-bordered w-full"
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rua + Número */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Rua</span>
                  </label>
                  <input
                    type="text"
                    value={endereco.rua}
                    onChange={(e) =>
                      handleEnderecoChange("rua", e.target.value)
                    }
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Número</span>
                  </label>
                  <input
                    type="text"
                    value={endereco.numero}
                    onChange={(e) =>
                      handleEnderecoChange("numero", e.target.value)
                    }
                    required
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Bairro */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Bairro</span>
                  </label>
                  <input
                    type="text"
                    value={endereco.bairro}
                    onChange={(e) =>
                      handleEnderecoChange("bairro", e.target.value)
                    }
                    required
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Estado */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Estado</span>
                  </label>
                  <div className="w-full">
                    <SelectEstado
                      onChange={(estado) =>
                        handleEnderecoChange("estado", estado || "")
                      }
                    />
                  </div>
                </div>

                {/* Cidade */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Cidade</span>
                  </label>
                  <div className="w-full">
                    <SelectCidade
                      uf={endereco.estado}
                      onChange={(cidade) =>
                        handleEnderecoChange("cidade", cidade || "")
                      }
                    />
                  </div>
                </div>

                {/* CEP */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">CEP</span>
                  </label>
                  <input
                    type="text"
                    value={endereco.cep}
                    onChange={(e) =>
                      handleEnderecoChange("cep", e.target.value)
                    }
                    required
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Senha</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirmar senha */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Confirmar Senha
                  </span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input input-bordered w-full"
                  placeholder="Confirme sua senha"
                />
                {fieldErrors.passwordMatch && (
                  <p className="text-error text-sm">
                    {fieldErrors.passwordMatch}
                  </p>
                )}
              </div>

              {/* Consentimento LGPD */}
              <div className="form-control">
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={consentimentoLGPD}
                    onChange={(e) => setConsentimentoLGPD(e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text text-sm">
                    Eu li e aceito a{" "}
                    <a href="/politica-privacidade" className="link">
                      política de privacidade
                    </a>
                    .
                  </span>
                </label>
                {fieldErrors.consentimento && (
                  <p className="text-error text-sm">
                    {fieldErrors.consentimento}
                  </p>
                )}
              </div>

              {errorMsg && <p className="text-error text-sm">{errorMsg}</p>}

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
