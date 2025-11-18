import { useEffect, useState } from "react";
import {
  fetchProducts,
  deleteProduct,
} from "../api/productsApi";

import AppLayout from "../components/layout/AppLayout";
import ProductForm from "../components/products/ProductForm";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    const data = await fetchProducts(search);
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const create = () => {
    setSelected(null);
    setShowForm(true);
  };

  const edit = (product) => {
    setSelected(product);
    setShowForm(true);
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteProduct(id);
    loadProducts();
  };

  return (
    <AppLayout>
      <div className="text-white">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Productos</h1>

          <button
            onClick={create}
            className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
          >
            Nuevo Producto
          </button>
        </div>

        {/* BUSCADOR */}
        <input
          className="w-full p-3 bg-white/10 border border-white/10 rounded text-white mb-4"
          placeholder="Buscar por código o nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLA */}
        <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Precio USD</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3">{p.product_code}</td>
                  <td className="p-3">{p.name}</td>

                  <td className="p-3 text-emerald-400">
                    ${Number(p.sale_price_usd).toFixed(2)}
                  </td>

                  <td
                    className={`p-3 font-semibold ${
                      p.stock <= p.min_stock ? "text-red-400" : "text-white"
                    }`}
                  >
                    {p.stock}
                  </td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => edit(p)}
                      className="text-emerald-400 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => remove(p.id)}
                      className="text-red-400 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td className="p-3 text-white/50">No hay productos</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <ProductForm
          product={selected}
          close={() => {
            setShowForm(false);
            loadProducts();
          }}
        />
      )}
    </AppLayout>
  );
}
