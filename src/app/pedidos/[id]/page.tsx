"use client";

import { Product } from "@/types/ProductTypes";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAddressFromCoords } from "@/lib/geocode";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";

interface Order {
  _id: string;
  orderId: string;
  products: Product[];
  total: number;
  status: "Pendente" | "Em Processo" | "Plantado";
  createdAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
  photoUrl?: string; // adicionamos o campo para guardar a foto da muda
}

const MapModal = dynamic(() => import("@/components/MapModal"), {
  ssr: false,
});

export default function UserOrdersPage() {
  const params = useParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState<string | undefined | null>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    async function fetchOrders() {
      const res = await fetch(`/api/pedidos/${params.id}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
        setMessage(null);

        // Buscar endereços aproximados
        data.forEach(async (order: Order) => {
          const addr = await getAddressFromCoords(
            order.location.latitude,
            order.location.longitude
          );
          setAddresses((prev) => ({ ...prev, [order._id]: addr }));
        });
      } else if ("message" in data) {
        setOrders([]);
        setMessage(data.message);
      }

      setLoading(false);
    }

    fetchOrders();
  }, [params?.id]);

  async function handleViewPhoto(orderId: string) {
    try {
      const res = await fetch(`/api/pedidos/${orderId}/foto`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPhoto(data.photoUrl);
      } else {
        alert("Foto não encontrada");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar foto");
    }
  }

  if (loading) return <p className="p-4">Carregando pedidos...</p>;
  if (message)
    return <p className="p-4 text-center text-gray-500">{message}</p>;

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Meus Pedidos</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="collapse collapse-arrow bg-base-100 shadow-md"
          >
            <input type="checkbox" />
            <div className="collapse-title flex items-center space-x-4">
              <Image
                src={order.products[0]?.imageUrl || "/placeholder.png"}
                alt="Produto"
                className="w-16 h-16 object-cover rounded"
                width={500}
                height={500}
              />
              <div>
                <p className="font-semibold">Pedido #{order.orderId}</p>
                <span
                  className={`badge ${
                    order.status === "Plantado"
                      ? "badge-success"
                      : order.status === "Em Processo"
                      ? "badge-warning"
                      : "badge-ghost"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="collapse-content space-y-2">
              <p className="text-sm text-gray-500">
                Criado em: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="space-y-2">
                {order.products.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center space-x-4 border-b pb-2"
                  >
                    <Image
                      src={p.imageUrl || "/placeholder.png"}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                      width={500}
                      height={500}
                    />
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantidade: {p.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-bold mt-2">Total: R$ {order.total}</p>

              <p
                className="text-sm text-blue-600 underline cursor-pointer mt-1"
                onClick={() => setSelectedOrder(order)}
              >
                {addresses[order._id] || "Localização aproximada"}
              </p>

              {order.status === "Plantado" && (
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={() => handleViewPhoto(order._id)}
                >
                  Ver foto da muda
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal do mapa */}
      {selectedOrder && (
        <MapModal
          opened={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          lat={selectedOrder.location.latitude}
          lng={selectedOrder.location.longitude}
        />
      )}

      {/* Modal da foto da muda */}
      {selectedPhoto && (
        <dialog open className="modal">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-2">Foto da Muda</h3>
            <Image
              src={selectedPhoto}
              alt="Foto da muda"
              width={600}
              height={400}
              className="rounded-md object-cover w-full"
            />
            <div className="modal-action">
              <Button onClick={() => setSelectedPhoto(null)}>Fechar</Button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
