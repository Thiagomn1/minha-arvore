"use client";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryList from "@/components/CategoryList";
import { useCart } from "@/context/useCart";
import { Category, Product } from "@/types";
import Hero from "../components/ui/Hero";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { data, isLoading } = useProducts();
  const [active, setActive] = useState("");
  const add = useCart((s) => s.add);

  const products = data?.products || [];
  const categories = data?.categories || [];

  // Set active category when data loads
  if (categories.length > 0 && !active) {
    setActive(categories[0].id);
  }

  const onAdd = (p: Product, qty: number) => {
    add({
      _id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      qty: qty ?? 1,
      category: p.category,
      imageUrl: p.imageUrl,
      status: p.status,
    });
  };

  if (isLoading) {
    return (
      <>
        <Hero />
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg">Carregando produtos...</p>
        </div>
      </>
    );
  }
  return (
    <>
      <Hero />
      <h2 className="text-5xl font-bold text-black mb-4 text-center mt-14">
        Sobre Nós
      </h2>
      <section className="w-ful py-12 px-6 md:px-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <Image
            src="/homesobre.jpg"
            alt="Natureza e árvores"
            width={800}
            height={800}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-green-400 mb-4">
            Minha Árvore
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            O Projeto tem como missão conectar pessoas e empresas ao ato de
            plantar árvores, contribuindo para a redução da emissão de CO₂ e a
            preservação do meio ambiente.
          </p>
          <br />
          <p className="text-lg text-gray-700 leading-relaxed">
            Aqui, você pode escolher mudas de árvores nativas e indicar o local
            para plantio, ajudando a restaurar ecossistemas e a criar um futuro
            mais verde.
          </p>
        </div>
      </section>
      <div className="divider m-auto w-4/5"></div>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Em Destaque</h2>
        <CategoryList
          categories={categories}
          active={active}
          onChange={setActive}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 w-full max-w-7xl mx-auto">
          {products
            .filter(
              (p) =>
                categories.find((c) => c.id === active)?.name === p.category
            )
            .map((p) => (
              <ProductCard product={p} key={p._id} onAdd={onAdd} />
            ))}
        </div>
      </div>
    </>
  );
}
