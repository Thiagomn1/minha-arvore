"use client";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function Sobre() {
  return (
    <main className="w-full min-h-screen bg-base-100 text-base-content">
      <section className="hero min-h-[70vh] bg-linear-to-r from-green-100 to-green-300">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <Image
            src="/mudaco2.jpeg"
            alt="Floresta sustentável"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl object-cover"
          />
          <div>
            <h1 className="text-5xl font-bold text-green-700">
              Sobre o Projeto 🌳
            </h1>
            <p className="py-6 text-lg text-gray-700 max-w-lg">
              O <span className="font-bold">Minha Árvore</span> nasceu com a
              missão de conectar pessoas e empresas ao ato de plantar árvores,
              reduzindo o impacto ambiental e promovendo um futuro mais
              sustentável para todos.
            </p>
            <Link href="/produtos">
              <Button variant="success">Conheça Nossas Mudas</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-20 bg-base-200">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-10">
          Por que isso é importante?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-green-700 mb-3">
              Emissão de CO₂
            </h3>
            <p className="text-gray-600">
              Uma pessoa emite em média{" "}
              <span className="font-bold">4 toneladas de CO₂</span> por ano,
              apenas com atividades do dia a dia como transporte, energia e
              consumo.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-green-700 mb-3">
              Plantar Árvores
            </h3>
            <p className="text-gray-600">
              Uma árvore pode absorver até{" "}
              <span className="font-bold">21 kg de CO₂ por ano</span>, ajudando
              a equilibrar o impacto da emissão de carbono.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-green-700 mb-3">
              Futuro Sustentável
            </h3>
            <p className="text-gray-600">
              Ao plantar hoje, estamos construindo um{" "}
              <span className="font-bold">futuro mais verde</span>, restaurando
              ecossistemas e garantindo qualidade de vida para as próximas
              gerações.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-20 text-center bg-linear-to-r from-green-200 to-green-200">
        <h2 className="text-3xl font-bold text-black mb-6">
          Faça parte dessa mudança!
        </h2>
        <p className="text-lg text-black max-w-2xl mx-auto mb-6">
          Cada muda plantada é um passo na luta contra as mudanças climáticas.
          Juntos, podemos criar um futuro mais equilibrado e cheio de vida.
        </p>
        <Link href="/produtos">
          <Button variant="success" className=" shadow-lg">
            Plante sua Árvore Agora 🌱
          </Button>
        </Link>
      </section>
    </main>
  );
}
