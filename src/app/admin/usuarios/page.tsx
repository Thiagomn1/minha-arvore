"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

interface Endereco {
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  tipoPessoa?: "PF" | "PJ";
  endereco?: Endereco;
  role: "User" | "Admin";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin/usuarios");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  function showToast(message: string, type: "success" | "error" = "success") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `alert ${
      type === "success" ? "alert-success" : "alert-error"
    } shadow-lg`;
    toast.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  async function handlePromote(id: string) {
    const res = await fetch(`/api/admin/usuarios/${id}/promote`, {
      method: "PUT",
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: "Admin" } : u))
      );
      showToast("Usuário promovido a Admin!");
    } else {
      showToast("Erro ao promover usuário", "error");
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col lg:flex-row">
      {/* Toasts */}
      <div id="toast-container" className="toast toast-top toast-end"></div>

      {/* Menu lateral */}
      <aside className="bg-base-100 shadow-md p-4 w-full lg:w-64">
        <h2 className="text-xl font-bold mb-4 lg:mb-6 text-center lg:text-left">
          Admin
        </h2>
        <ul className="menu menu-horizontal lg:menu-vertical flex justify-center lg:block">
          <li>
            <a href="/admin/">Home</a>
          </li>
          <li>
            <a href="/admin/pedidos">Pedidos</a>
          </li>
          <li className="font-semibold">
            <a className="active">Usuários</a>
          </li>
          <li>
            <a href="/admin/produtos">Produtos</a>
          </li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 lg:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Gerenciar Usuários
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Carregando usuários...</p>
        ) : (
          <div className="overflow-x-auto">
            {/* Tabela */}
            <table className="table-zebra hidden md:table w-full">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF/CNPJ</th>
                  <th>Role</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="cursor-pointer hover:bg-base-300"
                    onClick={() => setSelectedUser(u)}
                  >
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.cpf || u.cnpj || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "Admin" ? "badge-primary" : "badge-ghost"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.role !== "Admin" && (
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation(); // impede abrir modal
                            handlePromote(u._id);
                          }}
                        >
                          Tornar Admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cards em mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="card bg-base-100 shadow-md p-4 space-y-2 cursor-pointer hover:bg-base-200"
                  onClick={() => setSelectedUser(u)}
                >
                  <h2 className="font-bold text-lg">{u.name}</h2>
                  <p>
                    <span className="font-semibold">Email:</span> {u.email}
                  </p>
                  <p>
                    <span className="font-semibold">CPF/CNPJ:</span>{" "}
                    {u.cpf || u.cnpj || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span>{" "}
                    <span
                      className={`badge ${
                        u.role === "Admin" ? "badge-primary" : "badge-ghost"
                      }`}
                    >
                      {u.role}
                    </span>
                  </p>
                  {u.role !== "Admin" && (
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePromote(u._id);
                      }}
                    >
                      Tornar Admin
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de detalhes do usuário */}
      {selectedUser && (
        <dialog open className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              Detalhes do Usuário: {selectedUser.name}
            </h3>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedUser.email}
              </p>
              <p>
                <span className="font-semibold">Telefone:</span>{" "}
                {selectedUser.telefone || "-"}
              </p>
              <p>
                <span className="font-semibold">Tipo Pessoa:</span>{" "}
                {selectedUser.tipoPessoa}
              </p>
              <p>
                <span className="font-semibold">CPF:</span>{" "}
                {selectedUser.cpf || "-"}
              </p>
              <p>
                <span className="font-semibold">CNPJ:</span>{" "}
                {selectedUser.cnpj || "-"}
              </p>
              <p>
                <span className="font-semibold">Endereço:</span>{" "}
                {selectedUser.endereco
                  ? `${selectedUser.endereco.rua || ""}, ${
                      selectedUser.endereco.numero || ""
                    } - ${selectedUser.endereco.bairro || ""}, ${
                      selectedUser.endereco.cidade || ""
                    } - ${selectedUser.endereco.estado || ""}, CEP: ${
                      selectedUser.endereco.cep || ""
                    }`
                  : "-"}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {selectedUser.role}
              </p>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Fechar
                </Button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
