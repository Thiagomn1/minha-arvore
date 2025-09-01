"use client";

import Link from "next/link";
import { ArchiveBoxIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function PerfilPage() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6">
      <h1 className="text-2xl font-bold mb-8">Meu Perfil</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Botão de Pedidos */}
        <div className="card w-40 h-40 shadow-md border rounded-xl flex items-center justify-center hover:shadow-lg transition">
          <Link
            href={`/pedidos/${session?.user?.id}`}
            className="flex flex-col items-center gap-2"
          >
            <ArchiveBoxIcon className="w-12 h-12 text-success" />
            <span className="font-medium">Pedidos</span>
          </Link>
        </div>

        {/* Botão Editar Dados */}
        <div className="card w-40 h-40 shadow-md border rounded-xl flex items-center justify-center hover:shadow-lg transition">
          <Link
            href="/perfil/editar"
            className="flex flex-col items-center gap-2"
          >
            <UserCircleIcon className="w-12 h-12 text-success" />
            <span className="font-medium">Editar Dados</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
