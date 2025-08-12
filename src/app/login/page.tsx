"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.log(result?.error);
      setErrorMsg("Email ou senha inválidos");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="flex min-h-screen bg-base-200">
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
              Entrar
            </h1>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

              {errorMsg && (
                <p className="text-error text-sm mt-1">{errorMsg}</p>
              )}

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full rounded-md"
                >
                  Entrar
                </button>
              </div>
            </form>

            <p className="text-center text-sm mt-4">
              Não tem conta?{" "}
              <a href="/signup" className="link link-primary">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
