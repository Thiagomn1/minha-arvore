"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import CategoryList from "@/components/CategoryList";
import { useCart } from "@/context/useCart";
import { Category, Product } from "@/types/ProductTypes";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState("");
  const add = useCart((s) => s.add);

  useEffect(() => {
    fetch("/api/produtos")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setCategories(data.categories);
        setActive(data.categories[0]?.id || "");
      });
  }, []);

  const onAdd = (p: Product) => {
    add({
      _id: p._id,
      name: p.name,
      price: p.price,
      qty: 1,
      image: p.imageUrl,
    });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-black mb-10">
        Catálogo
      </h1>

      <div className="carousel w-full rounded-lg shadow-lg mb-12">
        {products.slice(0, 5).map((p, idx) => (
          <div
            key={p._id}
            id={`slide${idx}`}
            className="carousel-item relative w-full"
          >
            <Link href={`/products/${p._id}`} className="w-full block">
              <Image
                src={p.imageUrl}
                alt={p.name}
                width={1200}
                height={500}
                className="w-full h-[400px] object-cover rounded-lg"
              />
              <div className="absolute bottom-5 left-5 bg-black/50 text-white px-4 py-2 rounded-lg">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-sm">R$ {p.price}</p>
              </div>
            </Link>
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href={`#slide${
                  idx === 0 ? products.slice(0, 5).length - 1 : idx - 1
                }`}
                className="btn btn-circle"
              >
                ❮
              </a>
              <a
                href={`#slide${
                  idx === products.slice(0, 5).length - 1 ? 0 : idx + 1
                }`}
                className="btn btn-circle"
              >
                ❯
              </a>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {products
          .filter(
            (p) => categories.find((c) => c.id === active)?.name === p.category
          )
          .map((p) => (
            <ProductCard product={p} key={p._id} onAdd={onAdd} />
          ))}
      </div>
    </div>
  );
}
