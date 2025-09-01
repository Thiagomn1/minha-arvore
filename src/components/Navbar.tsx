"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ShoppingCartIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/useCart";

export default function Navbar({ gradient = false }: { gradient?: boolean }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const cartCount = useCart((s) => s.items.length);

  return (
    <div
      className={`absolute top-0 left-0 w-full z-50 navbar ${
        gradient
          ? "bg-gradient-to-b from-gray-400 to-transparent"
          : "bg-white border-b-2 border-gray-200"
      }`}
    >
      {/* navbar-start */}
      <div className="navbar-start">
        <Link
          href="/"
          className="text-xl font-bold hover:text-green-600 transition-colors"
        >
          Minha Árvore
        </Link>
      </div>

      {/* navbar-center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/co2">Cálculo CO₂</Link>
          </li>
          <li>
            <Link href="/products">Catálogo</Link>
          </li>
          <li>
            <Link href="/sobre">Sobre</Link>
          </li>
        </ul>
      </div>

      {/* navbar-end */}
      <div className="navbar-end flex items-center gap-2">
        {loading ? (
          <div className="btn btn-success rounded-md text-base loading">
            Carregando
          </div>
        ) : session?.user ? (
          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-gray-900 mr-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-success rounded-md text-base cursor-pointer flex items-center gap-2"
              >
                {session.user.name.split(" ")[0] || "Usuário"}
                <svg
                  className="dropdown-arrow"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4"
              >
                <li>
                  <Link href="/perfil">Perfil</Link>
                </li>
                <li>
                  <Link href={`/pedidos/${session?.user?.id}`}>Pedidos</Link>
                </li>
                <li>
                  {session?.user?.role === "Admin" && (
                    <Link href="/admin">Admin</Link>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="text-left w-full"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* Menu para telas pequenas */}
            <div className="dropdown dropdown-end lg:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <Bars3Icon className="h-6 w-6" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-4"
              >
                <li>
                  <Link href="/co2">Cálculo CO₂</Link>
                </li>
                <li>
                  <Link href="/products">Catálogo</Link>
                </li>
                <li>
                  <Link href="/sobre">Sobre</Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link href="/login" className="btn btn-success rounded-md text-base">
            Entrar
          </Link>
        )}
      </div>
    </div>
  );
}
