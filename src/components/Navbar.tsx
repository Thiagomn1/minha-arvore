"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // heroicons
import { useCart } from "@/context/useCart";

export default function Navbar({ gradient = false }: { gradient?: boolean }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const cartCount = useCart((s) => s.items.length); // quantidade de itens no carrinho

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
        {/* ...seu código do dropdown e logo */}
      </div>

      {/* navbar-center */}
      <div className="navbar-center hidden lg:flex">{/* ...seu menu */}</div>

      {/* navbar-end */}
      <div className="navbar-end flex items-center gap-2">
        {loading ? (
          <div className="btn btn-success rounded-md text-base loading">
            Carregando
          </div>
        ) : session?.user ? (
          <div className="flex items-center gap-4">
            {/* Ícone do carrinho */}
            <Link href="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-gray-900" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Dropdown do usuário */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-success rounded-md text-base cursor-pointer flex items-center gap-2"
              >
                {session.user.name || "Usuário"}
                <svg
                  className="ml-2 h-4 w-4 inline-block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
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
                  <Link href="/pedidos">Pedidos</Link>
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
