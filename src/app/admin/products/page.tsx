"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface ProductType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  status?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    status: "Disponível",
  });

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  function showToast(message: string, type: "success" | "error" = "success") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `alert ${
      type === "success" ? "alert-success" : "alert-error"
    } shadow-lg`;
    toast.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();

    // validação básica
    if (!newProduct.name || !newProduct.price) {
      showToast("Nome e preço são obrigatórios", "error");
      return;
    }

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProduct,
        price: parseFloat(newProduct.price),
      }),
    });

    if (res.ok) {
      const produtoCriado = await res.json();
      setProducts((prev) => [...prev, produtoCriado]);
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
    } else {
      showToast("Erro ao adicionar produto", "error");
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col lg:flex-row">
      {/* Container de toasts */}
      <div id="toast-container" className="toast toast-top toast-end"></div>

      {/* Menu lateral */}
      <aside className="bg-base-100 shadow-md p-4 w-full lg:w-64">
        <h2 className="text-xl font-bold mb-4 lg:mb-6 text-center lg:text-left">
          Admin
        </h2>
        <ul className="menu menu-horizontal lg:menu-vertical flex justify-center lg:block">
          <li>
            <a href="/admin/">Home</a>
          </li>
          <li>
            <a href="/admin/orders">Pedidos</a>
          </li>
          <li>
            <a href="/admin/users">Usuários</a>
          </li>
          <li className="font-semibold">
            <a className="active">Produtos</a>
          </li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Gerenciar Produtos</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Adicionar Produto
          </Button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="overflow-x-auto">
            {/* Tabela */}
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
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>R$ {p.price.toFixed(2)}</td>
                    <td>{p.category}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cards em telas pequenas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="card bg-base-100 shadow-md p-4 space-y-1"
                >
                  <h2 className="font-bold text-lg">{p.name}</h2>
                  <p>
                    <span className="font-semibold">Preço:</span> R${" "}
                    {p.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Categoria:</span>{" "}
                    {p.category}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {p.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de adicionar produto */}
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg">Novo Produto</h3>
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
          </div>
        </dialog>
      )}
    </div>
  );
}
