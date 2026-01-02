"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import { ArchiveBoxIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function PerfilPage() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6">
      <h1 className="text-2xl font-bold mb-8">Meu Perfil</h1>
      <ResponsiveGrid cols={2} gap={6}>
        <Link href={`/pedidos/${session?.user?.id}`}>
          <Card
            variant="small"
            className="w-40 h-40 border rounded-xl flex items-center justify-center hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <ArchiveBoxIcon className="w-12 h-12 text-success" />
              <span className="font-medium">Pedidos</span>
            </div>
          </Card>
        </Link>

        <Link href="/perfil/editar">
          <Card
            variant="small"
            className="w-40 h-40 border rounded-xl flex items-center justify-center hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <UserCircleIcon className="w-12 h-12 text-success" />
              <span className="font-medium">Editar Dados</span>
            </div>
          </Card>
        </Link>
      </ResponsiveGrid>
    </div>
  );
}
