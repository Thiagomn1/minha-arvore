"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Ops! Algo deu errado
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message ||
              "Ocorreu um erro inesperado. Por favor, tente novamente."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Tentar novamente
            </button>
            <Link
              href="/"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
