import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../api/productsApi";

export default function ProductForm({ product, close }) {
  const [form, setForm] = useState({
    product_code: product?.product_code || "",
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    cost_usd: product?.cost_usd || "",
    profit_percent: product?.profit_percent || "",
    sale_price_usd: product?.sale_price_usd || "",
    stock: product?.stock || "",
    min_stock: product?.min_stock || "",
  });

  // CALCULAR AUTOMÁTICO
  useEffect(() => {
    if (form.cost_usd && form.profit_percent) {
      const pct = Number(form.profit_percent) / 100;
      const price = Number(form.cost_usd) / (1 - pct);

      setForm((prev) => ({
        ...prev,
        sale_price_usd: price.toFixed(2),
      }));
    }
  }, [form.cost_usd, form.profit_percent]);

  const save = async () => {
    if (product) await updateProduct(product.id, form);
    else await createProduct(form);
    close();
  };

  const updateField = (field, val) =>
    setForm({ ...form, [field]: val });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl border border-white/10 w-[450px]">
        
        <h2 className="text-xl text-white font-semibold mb-4">
          {product ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <div className="space-y-3">

          {/* CAMPOS */}
          <input
            placeholder="Código"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.product_code}
            onChange={(e) => updateField("product_code", e.target.value)}
          />

          <input
            placeholder="Nombre"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />

          <textarea
            placeholder="Descripción"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />

          <input
            placeholder="Categoría"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          />

          <input
            type="number"
            placeholder="Costo USD"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.cost_usd}
            onChange={(e) => updateField("cost_usd", e.target.value)}
          />

          <input
            type="number"
            placeholder="Ganancia %"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.profit_percent}
            onChange={(e) =>
              updateField("profit_percent", e.target.value)
            }
          />

          <input
            type="number"
            readOnly
            placeholder="Precio Venta USD"
            className="w-full p-2 bg-white/20 text-white rounded border border-white/10"
            value={form.sale_price_usd}
          />

          <input
            type="number"
            placeholder="Stock"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.stock}
            onChange={(e) => updateField("stock", e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock mínimo"
            className="w-full p-2 bg-white/10 text-white rounded border border-white/10"
            value={form.min_stock}
            onChange={(e) => updateField("min_stock", e.target.value)}
          />
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={save}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 p-2 rounded text-white"
          >
            Guardar
          </button>

          <button
            onClick={close}
            className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
