"use client";
import { useState } from "react";
import { UserIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SelectEstado } from "@/components/ui/SelectEstado";
import { SelectCidade } from "@/components/ui/SelectCidade";

export default function EditarPerfilPage() {
  const [menu, setMenu] = useState<"dados" | "endereco" | "senha">("dados");
  const [loading, setLoading] = useState(false);

  // Dados pessoais
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // Endereço
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [cep, setCep] = useState("");

  // Senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmNovaSenha, setConfirmNovaSenha] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let payload = {};
    if (menu === "dados") payload = { nome, email };
    else if (menu === "endereco")
      payload = { endereco: { rua, numero, bairro, cidade, estado, cep } };
    else if (menu === "senha") {
      if (novaSenha !== confirmNovaSenha) {
        showToast("As senhas não coincidem", "error");
        setLoading(false);
        return;
      }
      payload = { senhaAtual, novaSenha };
    }

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: menu, payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao atualizar");

      showToast("Atualizado com sucesso!", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Editar Dados Pessoais
            </h2>
            <Input
              label="Nome completo"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        )}

        {menu === "endereco" && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Endereço</h2>
            <Input
              label="Rua"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
            <Input
              label="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
            <Input
              label="Bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <SelectEstado onChange={(uf) => setEstado(uf)} />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <SelectCidade
                uf={estado}
                onChange={(cidade) => setCidade(cidade)}
              />
            </div>

            <Input
              label="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        )}
        {menu === "senha" && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
            <Input
              label="Senha atual"
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
            <Input
              label="Nova senha"
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              value={confirmNovaSenha}
              onChange={(e) => setConfirmNovaSenha(e.target.value)}
            />
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Salvando..." : "Alterar Senha"}
            </Button>
          </form>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="toast toast-top toast-center z-50">
            <div
              className={`alert ${
                toastType === "success" ? "alert-success" : "alert-error"
              }`}
            >
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
