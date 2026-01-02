"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/context/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/useToast";
import MapPickerLazy from "@/components/MapPickerLazy";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/Loading";

export default function CartPage() {
  const { data: session } = useSession();
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total)();
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const router = useRouter();
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const { showToast } = useToast();
  const createOrder = useCreateOrder();

  const setMapLocation = (lat: string, lng: string) => {
    setLocation({ lat, lng });
  };

  const handleCheckout = async () => {
    if (!items.length || !location.lat || !location.lng || !session?.user?.id) {
      showToast("Preencha todos os campos", "error");
      return;
    }

    try {
      await createOrder.mutateAsync({
        userId: session.user.id,
        products: items.map((i) => ({
          _id: i._id,
          qty: i.qty,
          imageUrl: i.imageUrl,
        })),
        location: {
          latitude: Number(location.lat),
          longitude: Number(location.lng),
        },
      });

      clear();
      showToast("Pedido criado com sucesso!");
      router.push(`/pedidos/${session.user.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar pedido";
      showToast(errorMessage, "error");
    }
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    remove(itemId);
    showToast(`${itemName} removido do carrinho.`, "error");
  };

  const handleClearCart = () => {
    clear();
    showToast("Carrinho limpo.", "info");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div id="toast-container" className="toast toast-top toast-end" />

      <h2 className="text-3xl font-bold mb-6 text-primary">Seu Carrinho</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {items.length === 0 ? (
            <div className="alert alert-info shadow-lg">
              <span>Seu carrinho está vazio.</span>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="card card-bordered bg-base-100 shadow-md"
                >
                  <div className="card-body p-4 flex flex-row gap-4 items-center">
                    <div className="w-20 h-20 shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-sm opacity-70">Qtd: {item.qty}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        R$ {(item.price * item.qty).toFixed(2)}
                      </p>
                      <Button
                        variant="error"
                        className="btn-xs mt-2"
                        onClick={() => handleRemoveItem(item._id, item.name)}
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

        <div>
          <h3 className="font-semibold mb-2">Onde plantar?</h3>
          <MapPickerLazy onPick={setMapLocation} />

          <div className="mt-4 flex flex-col gap-3">
            <Button
              disabled={
                !items.length ||
                !location.lat ||
                !location.lng ||
                createOrder.isPending
              }
              onClick={handleCheckout}
              className="btn btn-primary w-full rounded-md"
            >
              {createOrder.isPending ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Processando...
                </span>
              ) : (
                "Finalizar Pedido"
              )}
            </Button>

            {items.length > 0 && (
              <Button onClick={handleClearCart} variant="error" outline>
                Limpar Carrinho
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
