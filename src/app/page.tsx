"use client";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategoryList from "../components/CategoryList";
import { categories as catMock } from "../lib/mockData";
import { useCart } from "../context/useCart";
import { Product } from "../types/ProductTypes";
import Hero from "../components/Hero";

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
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Em Destaque</h2>
        <CategoryList
          categories={catMock}
          active={active}
          onChange={setActive}
        />
        <div className="grid grid-cols-3 gap-4 mt-4">
          {products
            .filter((p: Product) => p.category === active)
            .map((p: Product) => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} />
            ))}
        </div>
      </div>
    </>
  );
}
