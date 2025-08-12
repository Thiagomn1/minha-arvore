"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validateCPF } from "../../lib/cpfValidator";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    cpf?: string;
    email?: string;
    passwordMatch?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isEmailValid = (value: string) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    if (!validateCPF(cpf)) {
      setFieldErrors((s) => ({ ...s, cpf: "CPF inválido" }));
      return;
    }
    if (!isEmailValid(email)) {
      setFieldErrors((s) => ({ ...s, email: "Email inválido" }));
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors((s) => ({
        ...s,
        passwordMatch: "As senhas não coincidem",
      }));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          cpf: cpf.replace(/[^\d]/g, ""),
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Erro ao criar conta");
      }
      setShowToast(true);

      // redireciona após 2s
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro desconhecido");
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
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nome</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Seu nome completo"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">CPF</span>
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  placeholder="Apenas números"
                  className="input input-bordered w-full"
                />
                {fieldErrors.cpf && (
                  <p className="text-error text-sm mt-1">{fieldErrors.cpf}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="input input-bordered w-full"
                />
                {fieldErrors.email && (
                  <p className="text-error text-sm mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Senha</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Confirmar senha
                  </span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirme sua senha"
                  className="input input-bordered w-full"
                />
                {fieldErrors.passwordMatch && (
                  <p className="text-error text-sm mt-1">
                    {fieldErrors.passwordMatch}
                  </p>
                )}
              </div>

              {errorMsg && (
                <p className="text-error text-sm mt-1">{errorMsg}</p>
              )}

              <div className="form-control mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full rounded-md"
                >
                  {loading ? "Cadastrando..." : "Criar Conta"}
                </button>
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
