import React, { useEffect, useState } from "react";
import { backend } from "../../api/backendClient";

export default function ProductDialog({ product, onClose }) {
  const editing = !!(product && product.id);

  const [form, setForm] = useState({
    name: "",
    code: "",
    stock: 0,
    sale_price_usd: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        code: product.code ?? "",
        stock: product.stock ?? 0,
        sale_price_usd: product.sale_price_usd ?? 0,
      });
    }
  }, [product]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      if (editing) {
        await backend.products.update(product.id, form);
      } else {
        await backend.products.create(form);
      }
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[420px] shadow">
        <h2 className="text-xl font-bold mb-4">
          {editing ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm">Nombre</label>
            <input
              value={form.name}
              className="w-full border p-2 rounded"
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Código</label>
            <input
              value={form.code}
              className="w-full border p-2 rounded"
              onChange={(e) => update("code", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Stock</label>
            <input
              type="number"
              value={form.stock}
              className="w-full border p-2 rounded"
              onChange={(e) => update("stock", parseInt(e.target.value || 0))}
            />
          </div>

          <div>
            <label className="text-sm">Precio USD</label>
            <input
              type="number"
              value={form.sale_price_usd}
              className="w-full border p-2 rounded"
              onChange={(e) => update("sale_price_usd", parseFloat(e.target.value || 0))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1 bg-sky-600 text-white rounded"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
