"use client";
import { useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CategoryList from "@/components/CategoryList";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import { useCart } from "@/context/useCart";
import { Product } from "@/types";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const { data, isLoading } = useProducts();
  const [active, setActive] = useState("");
  const [slide, setSlide] = useState(0);

  const add = useCart((s) => s.add);

  const products = data?.products || [];
  const categories = data?.categories || [];
  const totalSlides = products.slice(0, 5).length;

  const prevSlide = () => setSlide((s) => (s === 0 ? totalSlides - 1 : s - 1));
  const nextSlide = () => setSlide((s) => (s === totalSlides - 1 ? 0 : s + 1));

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
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-black mb-10">
        Catálogo
      </h1>

      <div className="carousel w-full rounded-lg shadow-lg mb-12">
        {products.slice(0, 5).map((p, idx) => (
          <div
            key={p._id}
            className={`carousel-item relative w-full ${
              idx === slide ? "block" : "hidden"
            }`}
          >
            <Link href={`/produtos/${p._id}`} className="w-full block">
              <Image
                src={p.imageUrl}
                alt={p.name}
                width={1200}
                height={500}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </Link>
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button onClick={prevSlide} className="btn btn-circle">
                ❮
              </button>
              <button onClick={nextSlide} className="btn btn-circle">
                ❯
              </button>
            </div>
            <div className="absolute bottom-5 left-5 bg-black/50 text-white px-4 py-2 rounded-lg">
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="text-sm">R$ {p.price}</p>
            </div>
          </div>
        ))}
      </div>

      <CategoryList
        categories={categories}
        active={active}
        onChange={setActive}
      />

      {/* Grid de produtos */}
      <ResponsiveGrid cols={4} gap={8} className="mt-8">
        {products
          .filter(
            (p) => categories.find((c) => c.id === active)?.name === p.category
          )
          .map((p) => (
            <ProductCard product={p} key={p._id} onAdd={onAdd} />
          ))}
      </ResponsiveGrid>
    </div>
  );
}
