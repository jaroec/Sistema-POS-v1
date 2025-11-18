// src/components/inventory/StockEntryForm.jsx
import { useEffect, useState } from "react";
import { createMovement } from "../../api/inventoryApi";
import { fetchProducts } from "../../api/productsApi";

export default function StockEntryForm({ onDone }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    type: "in",
    quantity: 1,
    reference: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts("").then((res) => {
      const items = Array.isArray(res) ? res : (res.items || []);
      setProducts(items);
    });
  }, []);

  const submit = async () => {
    try {
      if (!form.product_id) return alert("Selecciona un producto");
      setLoading(true);
      await createMovement(form);
      alert("Movimiento registrado");
      setForm({ product_id: "", type: "in", quantity: 1, reference: "", description: "" });
      onDone && onDone();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Error registrando movimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold mb-3">Registrar movimiento</h3>

      <select
        value={form.product_id}
        onChange={(e) => setForm({ ...form, product_id: e.target.value })}
        className="w-full p-2 mb-2 bg-white/5 text-white rounded border border-white/10"
      >
        <option value="">Seleccionar producto</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.product_code} — {p.name}
          </option>
        ))}
      </select>

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full p-2 mb-2 bg-white/5 text-white rounded border border-white/10"
      >
        <option value="in">Entrada</option>
        <option value="out">Salida</option>
        <option value="adjustment">Ajuste</option>
      </select>

      <input
        type="number"
        min="1"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        className="w-full p-2 mb-2 bg-white/5 text-white rounded border border-white/10"
        placeholder="Cantidad"
      />

      <input
        value={form.reference}
        onChange={(e) => setForm({ ...form, reference: e.target.value })}
        className="w-full p-2 mb-2 bg-white/5 text-white rounded border border-white/10"
        placeholder="Referencia (factura/guía)"
      />

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full p-2 mb-2 bg-white/5 text-white rounded border border-white/10 h-24"
        placeholder="Descripción / nota"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 p-2 rounded text-white"
      >
        {loading ? "Guardando..." : "Registrar movimiento"}
      </button>
    </div>
  );
}
