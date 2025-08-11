"use client";
import React from "react";
import Link from "next/link";

export default function Navbar({ gradient = false }: { gradient?: boolean }) {
  return (
    <div
      className={`absolute top-0 left-0 w-full z-50 navbar ${
        gradient
          ? "bg-gradient-to-b from-gray-400 to-transparent"
          : "bg-white border-b-2 border-gray-200"
      }`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/co2">Cálculo Co2</Link>
            </li>
            <li>
              <a>Catálogo</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Sobre</a>
            </li>
          </ul>
        </div>
        <Link href="/" className="ml-2 text-xl">
          Minha Árvore
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/co2">Cálculo Co2</Link>
          </li>
          <li>
            <details>
              <summary>Catálogo</summary>
              <ul className="p-2 min-w-30">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Sobre</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-success rounded-md">Entrar</a>
      </div>
    </div>
  );
}
