"use client";

import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import { useToast } from "@/hooks/useToast";
import { useAdminUsers, usePromoteUser } from "@/hooks/useUsers";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminUsers();
  const promoteUserMutation = usePromoteUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { showToast } = useToast();

  const users = data?.users || [];

  async function handlePromote(id: string) {
    try {
      await promoteUserMutation.mutateAsync(id);
      showToast("Usuário promovido a Admin!");
    } catch {
      showToast("Erro ao promover usuário", "error");
    }
  }

  return (
    <AdminLayout>
      <div id="toast-container" className="toast toast-top toast-end" />
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Gerenciar Usuários
        </h1>

        {isLoading ? (
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
                      <StatusBadge status={u.role} variant="user" />
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
            <ResponsiveGrid cols={2} gap={4} className="md:hidden">
              {users.map((u) => (
                <Card
                  key={u._id}
                  variant="admin"
                  padding="md"
                  className="space-y-2"
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
                    <StatusBadge status={u.role} variant="user" />
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
                </Card>
              ))}
            </ResponsiveGrid>
          </div>
        )}

      {/* Modal de detalhes do usuário */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`Detalhes do Usuário: ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && (
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
        )}
      </Modal>
    </AdminLayout>
  );
}
