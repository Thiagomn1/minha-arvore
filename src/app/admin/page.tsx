"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import Card from "@/components/ui/Card";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import Link from "next/link";

export default function AdminHomePage() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">Painel de Administração</h1>
      <p className="text-lg">
        Bem-vindo ao painel administrativo. Selecione uma opção no menu para gerenciar o sistema.
      </p>

      <ResponsiveGrid cols={3} gap={6} className="mt-6">
        <Link href="/admin/pedidos">
          <Card variant="default" padding="lg" className="hover:bg-base-200 transition cursor-pointer">
            <h2 className="text-xl font-semibold">📦 Pedidos</h2>
            <p>Gerencie todos os pedidos realizados.</p>
          </Card>
        </Link>
        <Link href="/admin/usuarios">
          <Card variant="default" padding="lg" className="hover:bg-base-200 transition cursor-pointer">
            <h2 className="text-xl font-semibold">👥 Usuários</h2>
            <p>Controle os usuários do sistema.</p>
          </Card>
        </Link>
        <Link href="/admin/produtos">
          <Card variant="default" padding="lg" className="hover:bg-base-200 transition cursor-pointer">
            <h2 className="text-xl font-semibold">🛒 Produtos</h2>
            <p>Adicione, edite e remova produtos.</p>
          </Card>
        </Link>
      </ResponsiveGrid>
    </AdminLayout>
  );
}
