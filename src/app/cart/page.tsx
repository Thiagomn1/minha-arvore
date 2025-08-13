"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/useCart";
import MapPicker from "@/components/MapPicker";

export default function CartPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total)();
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);

  console.log(items);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const setMapLocation = (lat: string, lng: string) => {
    setLocation({ lat, lng });
  };

  const checkout = async () => {
    if (!items.length || !location.lat || !location.lng) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: items.map((i) => ({
            productId: i.id,
            quantity: i.qty,
          })),
          location,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Redireciona para o Stripe Checkout
        window.location.href = data.url;
      } else {
        alert("Erro ao criar checkout.");
      }
      //eslint-disable-next-line
    } catch (err: any) {
      console.error(err);
      alert("Ocorreu um erro ao processar o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Seu Carrinho</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          {items.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <strong>{i.name}</strong>
                    <div className="text-sm">Qtd: {i.qty}</div>
                  </div>
                  <div>
                    <div>R$ {i.price * i.qty}</div>
                    <button
                      className="text-red-600 text-sm"
                      onClick={() => remove(i.id)}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            Total: <strong>R$ {total}</strong>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Onde plantar?</h3>
          <MapPicker onPick={setMapLocation} />
          <div className="mt-3">
            <button
              disabled={
                !items.length || !location.lat || !location.lng || loading
              }
              onClick={checkout}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Processando..." : "Finalizar e pagar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
