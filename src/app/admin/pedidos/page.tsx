"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

interface ProductType {
  _id: string;
  name: string;
  imageUrl?: string;
  qty: number;
}

interface OrderType {
  _id: string;
  orderId: string;
  products: ProductType[];
  total: number;
  status: "Pendente" | "Em Processo" | "Plantado";
  location: { latitude: number; longitude: number };
  mudaImage?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [mudaFile, setMudaFile] = useState<File | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/admin/pedidos");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const handleUploadImage = async () => {
    if (!selectedOrder || !mudaFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("mudaImage", mudaFile);

    try {
      const res = await fetch(
        `/api/admin/pedidos/${selectedOrder._id}/upload-image`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
        setShowModal(false);
        setMudaFile(null);
        showToast(
          "Imagem enviada com sucesso! Pedido atualizado para 'Plantado'."
        );
      } else {
        showToast("Erro ao enviar imagem", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Erro ao enviar imagem", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col lg:flex-row">
      <div id="toast-container" className="toast toast-top toast-end" />

      {/* Sidebar */}
      <aside className="bg-base-100 shadow-md p-4 w-full lg:w-64">
        <h2 className="text-xl font-bold mb-4 lg:mb-6 text-center lg:text-left">
          Admin
        </h2>
        <ul className="menu menu-horizontal lg:menu-vertical flex justify-center lg:block">
          <li>
            <a href="/admin/">Home</a>
          </li>
          <li className="font-semibold">
            <a className="active">Pedidos</a>
          </li>
          <li>
            <a href="/admin/usuarios">Usuários</a>
          </li>
          <li>
            <a href="/admin/produtos">Produtos</a>
          </li>
        </ul>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-4 lg:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Gerenciar Pedidos
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Carregando pedidos...</p>
        ) : (
          <>
            {/* Tabela desktop */}
            <div className="overflow-x-auto hidden md:block">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Status</th>
                    <th>Produtos</th>
                    <th>Total</th>
                    <th>Local</th>
                    <th>Foto Muda</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>{o.orderId}</td>
                      <td>
                        <span
                          className={`badge ${
                            o.status === "Plantado"
                              ? "badge-success"
                              : o.status === "Em Processo"
                              ? "badge-warning"
                              : "badge-ghost"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td>
                        {o.products.map((p) => (
                          <div key={p._id}>
                            {p.name} x{p.qty}
                          </div>
                        ))}
                      </td>
                      <td>R$ {o.total.toFixed(2)}</td>
                      <td>
                        Lat: {o.location.latitude}, Lng: {o.location.longitude}
                      </td>
                      <td>
                        {o.mudaImage ? (
                          <button
                            onClick={() => setLightboxImage(o.mudaImage!)}
                          >
                            <Image
                              src={o.mudaImage}
                              alt="Foto da Muda"
                              width={80}
                              height={80}
                              className="rounded"
                            />
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                      {o.mudaImage ? (
                        <td className="flex flex-col gap-2 ">
                          <Button
                            variant="primary"
                            onClick={() => {
                              setSelectedOrder(o);
                              setShowModal(true);
                            }}
                          >
                            Atualizar Foto
                          </Button>
                        </td>
                      ) : (
                        <td className="flex flex-col gap-2">
                          <Button
                            variant="primary"
                            onClick={() => {
                              setSelectedOrder(o);
                              setShowModal(true);
                            }}
                          >
                            Enviar Foto
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {orders.map((o) => (
                <div key={o._id} className="card bg-base-100 shadow-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">Pedido #{o.orderId}</p>
                      <span
                        className={`badge ${
                          o.status === "Plantado"
                            ? "badge-success"
                            : o.status === "Em Processo"
                            ? "badge-warning"
                            : "badge-ghost"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                    {o.mudaImage && (
                      <button onClick={() => setLightboxImage(o.mudaImage!)}>
                        <Image
                          src={o.mudaImage}
                          alt="Foto da Muda"
                          width={60}
                          height={60}
                          className="rounded"
                        />
                      </button>
                    )}
                  </div>
                  <p className="font-semibold">Produtos:</p>
                  <ul className="ml-2 mb-2">
                    {o.products.map((p) => (
                      <li key={p._id}>
                        {p.name} x{p.qty}
                      </li>
                    ))}
                  </ul>
                  <p>Total: R$ {o.total.toFixed(2)}</p>
                  <p>
                    Local: Lat {o.location.latitude}, Lng {o.location.longitude}
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedOrder(o);
                        setShowModal(true);
                      }}
                    >
                      Enviar Foto
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showModal && selectedOrder && (
          <dialog open className="modal">
            <div className="modal-box max-w-md">
              <h3 className="font-bold text-lg mb-2">Enviar foto da muda</h3>
              <p>Pedido #{selectedOrder.orderId}</p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setMudaFile(e.target.files?.[0] || null)}
              />
              <div className="modal-action">
                <Button
                  onClick={handleUploadImage}
                  variant="primary"
                  disabled={uploading}
                >
                  {uploading ? "Enviando..." : "Salvar"}
                </Button>
                <Button onClick={() => setShowModal(false)} variant="secondary">
                  Cancelar
                </Button>
              </div>
            </div>
          </dialog>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <dialog open className="modal">
            <div className="modal-box p-0 relative">
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setLightboxImage(null)}
              >
                ✕
              </button>
              <Image
                src={lightboxImage}
                alt="Imagem da muda"
                width={800}
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
          </dialog>
        )}
      </main>
    </div>
  );
}
