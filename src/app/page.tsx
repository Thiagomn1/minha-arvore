"use client";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategoryList from "../components/CategoryList";
import { categories as catMock } from "../lib/mockData";
import { useCart } from "../context/useCart";
import { Product } from "../types/ProductTypes";
import Hero from "../components/Hero";
import Image from "next/image";
import homesobre from "../assets/homesobre.jpg";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(catMock[0].id);
  const add = useCart((s) => s.add);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  const onAdd = (p: Product) => {
    add({ id: p.id, name: p.name, price: p.price, qty: 1 });
  };

  return (
    <>
      <Hero />
      <h2 className="text-5xl font-bold text-black mb-4 text-center mt-14">
        Sobre Nós
      </h2>
      <section className="w-ful py-12 px-6 md:px-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <Image
            src={homesobre}
            alt="Natureza e árvores"
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
          categories={catMock}
          active={active}
          onChange={setActive}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 w-full max-w-7xl mx-auto">
          {products
            .filter((p: Product) => p.category === active)
            .map((p: Product) => (
              <ProductCard product={p} key={p.id} onAdd={onAdd} />
            ))}
        </div>
      </div>
    </>
  );
}
