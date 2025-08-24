"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

interface UserType {
  _id: string;
  name: string;
  email: string;
  cpf?: string;
  role: "User" | "Admin";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin/users");
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
    const res = await fetch(`/api/admin/users/${id}/promote`, {
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
            <a href="/admin/orders">Pedidos</a>
          </li>
          <li className="font-semibold">
            <a className="active">Usuários</a>
          </li>
          <li>
            <a href="/admin/products">Produtos</a>
          </li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 lg:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Gerenciar Usuários
        </h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="overflow-x-auto">
            {/* Tabela */}
            <table className="table-zebra hidden md:table w-full">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Role</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.cpf || "-"}</td>
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
                          onClick={() => handlePromote(u._id)}
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
                  className="card bg-base-100 shadow-md p-4 space-y-2"
                >
                  <h2 className="font-bold text-lg">{u.name}</h2>
                  <p>
                    <span className="font-semibold">Email:</span> {u.email}
                  </p>
                  <p>
                    <span className="font-semibold">CPF:</span> {u.cpf || "-"}
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
                      onClick={() => handlePromote(u._id)}
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
    </div>
  );
}
