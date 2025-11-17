"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { href: "/admin/", label: "Home" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/produtos", label: "Produtos" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col lg:flex-row">
      <aside className="bg-base-100 shadow-md p-4 w-full lg:w-64">
        <h2 className="text-xl font-bold mb-4 lg:mb-6 text-center lg:text-left">
          Admin
        </h2>
        <ul className="menu menu-horizontal lg:menu-vertical flex justify-center lg:block">
          {menuItems.map((item) => (
            <li key={item.href} className={cn(isActive(item.href) && "font-semibold")}>
              <Link
                href={item.href}
                className={cn(isActive(item.href) && "active")}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-4 lg:p-6">{children}</main>
    </div>
  );
}
