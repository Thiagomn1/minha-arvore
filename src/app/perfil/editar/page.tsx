"use client";
import { useState, useMemo } from "react";
import { UserIcon, HomeIcon, KeyIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SelectEstado } from "@/components/ui/SelectEstado";
import { SelectCidade } from "@/components/ui/SelectCidade";
import { useToast } from "@/hooks/useToast";
import { useUpdateUser, useCurrentUser } from "@/hooks/useUsers";

export default function EditarPerfilPage() {
  const [menu, setMenu] = useState<"dados" | "endereco" | "senha">("dados");
  const updateUserMutation = useUpdateUser();
  const { data: userData, isLoading } = useCurrentUser();

  const user = useMemo(() => userData?.user as any, [userData]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [cep, setCep] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmNovaSenha, setConfirmNovaSenha] = useState("");

  const { showToast } = useToast();

  const currentNome = nome || user?.name || "";
  const currentEmail = email || user?.email || "";
  const currentRua = rua || user?.endereco?.rua || "";
  const currentNumero = numero || user?.endereco?.numero || "";
  const currentBairro = bairro || user?.endereco?.bairro || "";
  const currentCidade = cidade || user?.endereco?.cidade || "";
  const currentEstado = estado || user?.endereco?.estado || null;
  const currentCep = cep || user?.endereco?.cep || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let payload = {};
    if (menu === "dados") payload = { nome: currentNome, email: currentEmail };
    else if (menu === "endereco")
      payload = {
        endereco: {
          rua: currentRua,
          numero: currentNumero,
          bairro: currentBairro,
          cidade: currentCidade,
          estado: currentEstado,
          cep: currentCep
        }
      };
    else if (menu === "senha") {
      if (novaSenha !== confirmNovaSenha) {
        showToast("As senhas não coincidem", "error");
        return;
      }
      payload = { senhaAtual, novaSenha };
    }

    try {
      await updateUserMutation.mutateAsync({ type: menu, payload });
      showToast("Atualizado com sucesso!", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      showToast(message, "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      <div id="toast-container" className="toast toast-top toast-center" />

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

      <main className="flex-1 p-8">
        {menu === "dados" && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Editar Dados Pessoais
            </h2>
            <Input
              label="Nome completo"
              placeholder="Nome completo"
              value={currentNome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={currentEmail}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              variant="success"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        )}

        {menu === "endereco" && (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Endereço</h2>
            <Input
              label="Rua"
              value={currentRua}
              onChange={(e) => setRua(e.target.value)}
            />
            <Input
              label="Número"
              value={currentNumero}
              onChange={(e) => setNumero(e.target.value)}
            />
            <Input
              label="Bairro"
              value={currentBairro}
              onChange={(e) => setBairro(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <SelectEstado
                value={currentEstado}
                onChange={(uf) => setEstado(uf)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <SelectCidade
                uf={currentEstado}
                value={currentCidade}
                onChange={(cidade) => setCidade(cidade)}
              />
            </div>

            <Input
              label="CEP"
              value={currentCep}
              onChange={(e) => setCep(e.target.value)}
            />
            <Button
              type="submit"
              variant="success"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Salvando..." : "Salvar"}
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
            <Button
              type="submit"
              variant="success"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Salvando..." : "Alterar Senha"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
