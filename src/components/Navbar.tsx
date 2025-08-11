"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar({ gradient = false }: { gradient?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header
      className={`absolute top-0 left-0 w-full z-50 ${
        gradient
          ? "bg-gradient-to-b from-gray-400 to-transparent"
          : "bg-white border-b-2 border-gray-200"
      }`}
    >
      <div className="px-4 mx-auto sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" title="" className="inline-flex">
              <span>Minha Árvore</span>
            </Link>
          </div>

          {/* Menu central visível só em lg+ */}
          <nav className="hidden lg:flex lg:justify-center lg:items-center lg:space-x-10 xl:space-x-14">
            <Link
              href="/co2"
              className="text-base font-medium text-black transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              Cálculo CO2
            </Link>

            <Link
              href="#"
              className="text-base font-medium text-black transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              Catálogo
            </Link>

            <Link
              href="#"
              className="text-base font-medium text-black transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              Sobre
            </Link>
          </nav>

          <div className="flex items-center justify-end space-x-3 lg:space-x-5">
            {/* Menu Hamburger - visível só em telas menores que lg */}
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="inline-flex items-center justify-center p-2 text-black rounded-md lg:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <Link
              href="#"
              title=""
              className="text-base font-medium text-black transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:text-white"
            >
              <button className="bg-gray-800 rounded-md px-4 py-2 hover:cursor-pointer hover:bg-gray-900 transition">
                <span className="text-white">Entrar</span>
              </button>
            </Link>

            <Link
              href="/cart"
              className="relative p-2 -m-2 text-white transition-all duration-200 hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dropdown do menu hamburger - visível só quando aberto e em telas menores que lg */}
      {menuOpen && (
        <nav className="lg:hidden bg-gray-100 bg-opacity-90 border-t border-gray-300">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Cálculo CO2
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
