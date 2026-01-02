"use client";

import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProductStatus,
} from "@/hooks/useProducts";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const { data, isLoading } = useAdminProducts();
  const createProductMutation = useCreateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    status: "Disponível",
  });
  const { showToast } = useToast();

  const products = data?.products || [];

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price) {
      showToast("Nome e preço são obrigatórios", "error");
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        imageUrl: newProduct.imageUrl,
        category: newProduct.category,
        status: newProduct.status as any,
      });

      setShowModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        status: "Disponível",
      });
      showToast("Produto adicionado!", "success");
    } catch (error) {
      console.error(error);
      showToast("Erro ao adicionar produto", "error");
    }
  }

  async function handleUpdateStatus(productId: string, newStatus: string) {
    try {
      await updateStatusMutation.mutateAsync({
        id: productId,
        status: newStatus,
      });

      setSelectedProduct((prev) =>
        prev ? { ...prev, status: newStatus as any } : prev
      );

      showToast("Status atualizado!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro inesperado ao atualizar status", "error");
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await deleteProductMutation.mutateAsync(id);
      setShowDetailsModal(false);
      showToast("Produto deletado!", "success");
    } catch {
      showToast("Erro ao deletar produto", "error");
    }
  }

  return (
    <AdminLayout>
      <div id="toast-container" className="toast toast-top toast-end" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Gerenciar Produtos</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Adicionar Produto
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Carregando produtos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-zebra hidden md:table w-full">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="cursor-pointer hover:bg-base-300"
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowDetailsModal(true);
                  }}
                >
                  <td>{p.name}</td>
                  <td>R$ {p.price.toFixed(2)}</td>
                  <td>{p.category}</td>
                  <td>
                    <StatusBadge status={p.status} variant="product" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ResponsiveGrid cols={2} gap={4} className="md:hidden">
            {products.map((p) => (
              <Card
                key={p._id}
                variant="admin"
                padding="md"
                className="space-y-1"
                onClick={() => {
                  setSelectedProduct(p);
                  setShowDetailsModal(true);
                }}
              >
                <h2 className="font-bold text-lg">{p.name}</h2>
                <p>
                  <span className="font-semibold">Preço:</span> R${" "}
                  {p.price.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Categoria:</span> {p.category}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <StatusBadge status={p.status} variant="product" />
                </p>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>
      )}

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Novo Produto"
          size="sm"
          actions={null}
        >
          <form className="space-y-3" onSubmit={handleAddProduct}>
            <Input
              label="Nome"
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Descrição</span>
              </label>
              <textarea
                placeholder="Descrição"
                className="textarea textarea-bordered w-full"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <Input
              label="Preço"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <Input
              label="URL da Imagem"
              type="text"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
            />
            <Input
              label="Categoria"
              type="text"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Status</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, status: e.target.value })
                }
              >
                <option value="Disponível">Disponível</option>
                <option value="Indisponível">Indisponível</option>
              </select>
            </div>

            <div className="modal-action">
              <Button type="submit" variant="primary">
                Salvar
              </Button>
              <Button type="button" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {showDetailsModal && selectedProduct && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={selectedProduct.name}
          size="md"
          actions={
            <>
              <Button
                variant="error"
                onClick={() => handleDeleteProduct(selectedProduct._id)}
              >
                Deletar
              </Button>
              <Button onClick={() => setShowDetailsModal(false)}>Fechar</Button>
            </>
          }
        >
          <div className="space-y-4">
            {selectedProduct.imageUrl && (
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                width={400}
                height={300}
                className="rounded-md object-cover w-full"
              />
            )}
            <p>
              <span className="font-semibold">Descrição:</span>{" "}
              {selectedProduct.description || "Sem descrição"}
            </p>
            <p>
              <span className="font-semibold">Preço:</span> R${" "}
              {selectedProduct.price.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">Categoria:</span>{" "}
              {selectedProduct.category || "N/A"}
            </p>

            <div className="flex items-center gap-3">
              <span className="font-semibold">Status:</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={selectedProduct.status === "Disponível"}
                onChange={(e) =>
                  handleUpdateStatus(
                    selectedProduct._id,
                    e.target.checked ? "Disponível" : "Indisponível"
                  )
                }
              />
              <span>{selectedProduct.status}</span>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
