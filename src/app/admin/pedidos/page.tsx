"use client";

import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import Input from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { useAdminOrders, useUploadOrderImage } from "@/hooks/useOrders";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const { data, isLoading } = useAdminOrders();
  const uploadImageMutation = useUploadOrderImage();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mudaFile, setMudaFile] = useState<File | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const orders = data?.orders || [];

  const handleUploadImage = async () => {
    if (!selectedOrder || !mudaFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("mudaImage", mudaFile);

    try {
      await uploadImageMutation.mutateAsync({
        id: selectedOrder._id,
        formData,
      });

      setShowModal(false);
      setMudaFile(null);
      showToast(
        "Imagem enviada com sucesso! Pedido atualizado para 'Plantado'."
      );
    } catch (err) {
      console.error(err);
      showToast("Erro ao enviar imagem", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div id="toast-container" className="toast toast-top toast-end" />
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Gerenciar Pedidos</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Carregando pedidos...</p>
      ) : (
        <>
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
                      <StatusBadge status={o.status} variant="order" />
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
                      Lat: {o.location?.latitude}, Lng: {o.location?.longitude}
                    </td>
                    <td>
                      {o.mudaImage ? (
                        <button onClick={() => setLightboxImage(o.mudaImage!)}>
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

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {orders.map((o) => (
              <Card key={o._id} variant="small" padding="md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold">Pedido #{o.orderId}</p>
                    <StatusBadge status={o.status} variant="order" />
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
                  Local: Lat {o.location?.latitude}, Lng {o.location?.longitude}
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
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={showModal && !!selectedOrder}
        onClose={() => setShowModal(false)}
        title="Enviar foto da muda"
        size="sm"
        actions={
          <>
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
          </>
        }
      >
        {selectedOrder && (
          <>
            <p>Pedido #{selectedOrder.orderId}</p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setMudaFile(e.target.files?.[0] || null)}
            />
          </>
        )}
      </Modal>

      <Modal
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        size="xl"
        actions={null}
      >
        {lightboxImage && (
          <div className="relative">
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
        )}
      </Modal>
    </AdminLayout>
  );
}
