import React, { useEffect, useState } from "react";
import { backend } from "../../api/backendClient";

export default function CustomerDialog({ customer, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    credit_limit_usd: 0,
  });

  const [loading, setLoading] = useState(false);
  const editing = !!(customer && customer.id);

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        credit_limit_usd: customer.credit_limit_usd || 0,
      });
    }
  }, [customer]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      if (editing) {
        await backend.customers.update(customer.id, form);
      } else {
        await backend.customers.create(form);
      }
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px] shadow">
        <h2 className="text-xl font-bold mb-4">
          {editing ? "Editar Cliente" : "Nuevo Cliente"}
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
            <label className="text-sm">Teléfono</label>
            <input
              value={form.phone}
              className="w-full border p-2 rounded"
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              value={form.email}
              className="w-full border p-2 rounded"
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Dirección</label>
            <textarea
              value={form.address}
              className="w-full border p-2 rounded"
              onChange={(e) => update("address", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Límite de crédito (USD)</label>
            <input
              type="number"
              value={form.credit_limit_usd}
              className="w-full border p-2 rounded"
              onChange={(e) => update("credit_limit_usd", parseFloat(e.target.value || 0))}
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
            className="px-4 py-1 bg-emerald-600 text-white rounded"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
