"use client";

export default function AdminHomePage() {
  return (
    <div className="flex min-h-screen bg-base-200">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Painel de Administração</h1>
        <p className="text-lg">
          Bem-vindo ao painel administrativo. Selecione uma opção no menu à
          esquerda para gerenciar o sistema.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <a href="/admin/orders" className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold">📦 Pedidos</h2>
            <p>Gerencie todos os pedidos realizados.</p>
          </a>
          <a href="/admin/users" className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold">👥 Usuários</h2>
            <p>Controle os usuários do sistema.</p>
          </a>
          <a href="/admin/products" className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold">🛒 Produtos</h2>
            <p>Adicione, edite e remova produtos.</p>
          </a>
        </div>
      </main>
    </div>
  );
}
