"use client";

import { useState } from "react";
import { UserIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

export default function EditarPerfilPage() {
  const [menu, setMenu] = useState<"dados" | "endereco" | "senha">("dados");

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Menu Lateral */}
      <aside className="w-64 bg-base-200 p-4 border-r">
        <ul className="menu">
          <li>
            <button
              onClick={() => setMenu("dados")}
              className={
                menu === "dados"
                  ? "active flex items-center gap-2"
                  : "flex items-center gap-2"
              }
            >
              <UserIcon className="w-5 h-5" />
              Dados Pessoais
            </button>
          </li>
          <li>
            <button
              onClick={() => setMenu("endereco")}
              className={
                menu === "endereco"
                  ? "active flex items-center gap-2"
                  : "flex items-center gap-2"
              }
            >
              <HomeIcon className="w-5 h-5" />
              Endereço
            </button>
          </li>
          <li>
            <button
              onClick={() => setMenu("senha")}
              className={
                menu === "senha"
                  ? "active flex items-center gap-2"
                  : "flex items-center gap-2"
              }
            >
              <KeyIcon className="w-5 h-5" />
              Alterar Senha
            </button>
          </li>
        </ul>
      </aside>

      {/* Formulários */}
      <main className="flex-1 p-8">
        {menu === "dados" && (
          <form className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Editar Dados Pessoais
            </h2>
            <input
              type="text"
              placeholder="Nome completo"
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <Button type="submit" variant="success">
              Salvar
            </Button>
          </form>
        )}

        {menu === "endereco" && (
          <form className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Endereço</h2>
            <input
              type="text"
              placeholder="Rua"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Número"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Bairro"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Cidade"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Estado"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="CEP"
              className="input input-bordered w-full"
            />
            <Button type="submit" variant="success">
              Salvar
            </Button>
          </form>
        )}

        {menu === "senha" && (
          <form className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
            <input
              type="password"
              placeholder="Senha atual"
              className="input input-bordered w-full"
            />
            <input
              type="password"
              placeholder="Nova senha"
              className="input input-bordered w-full"
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              className="input input-bordered w-full"
            />
            <Button type="submit" variant="success">
              Alterar Senha
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
