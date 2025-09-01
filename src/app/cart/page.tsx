"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/useCart";
import MapPicker from "@/components/MapPicker";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { data: session } = useSession();
  const [hasMounted, setHasMounted] = useState(false);
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total)();
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [loading, setLoading] = useState(false);

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
            imageUrl: i.image,
          })),
          location: {
            latitude: Number(location.lat),
            longitude: Number(location.lng),
          },
          userId: session?.user?.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        clear();
        router.push(`/pedidos/${session?.user?.id}`);
      } else {
        alert(data.error || "Erro ao criar pedido.");
      }
      //eslint-disable-next-line
    } catch (err: any) {
      console.error(err);
      alert("Ocorreu um erro ao processar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">Seu Carrinho</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lista de Itens */}
        <div>
          {items.length === 0 ? (
            <div className="alert alert-info shadow-lg">
              <span>Seu carrinho está vazio.</span>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="card card-bordered bg-base-100 shadow-md"
                >
                  <div className="card-body p-4 flex flex-row gap-4 items-center">
                    <div className="w-20 h-20 flex-shrink-0">
                      <Image
                        src={i.image}
                        alt={i.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold">{i.name}</h4>
                      <p className="text-sm opacity-70">Qtd: {i.qty}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        R$ {(i.price * i.qty).toFixed(2)}
                      </p>
                      <Button
                        variant="error"
                        className="btn-xs mt-2"
                        onClick={() => remove(i.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && (
            <div className="mt-6 p-4 bg-base-200 rounded-lg flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg text-primary font-bold">
                R$ {total.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Mapa e Checkout */}
        <div>
          <h3 className="font-semibold mb-2">Onde plantar?</h3>
          <MapPicker onPick={setMapLocation} />

          <div className="mt-4 flex flex-col gap-3">
            <Button
              disabled={
                !items.length || !location.lat || !location.lng || loading
              }
              onClick={checkout}
              className="btn btn-primary w-full rounded-md"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Finalizar Pedido"
              )}
            </Button>
            {items.length > 0 && (
              <Button onClick={clear} variant="error" outline>
                Limpar Carrinho
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
