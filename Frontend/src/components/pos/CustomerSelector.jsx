import React from "react";

/**
 * Props:
 * - customers: array
 * - selectedCustomer
 * - setSelectedCustomer
 */
export default function CustomerSelector({ customers = [], selectedCustomer, setSelectedCustomer }) {
  return (
    <div className="mt-4 bg-white/6 backdrop-blur-md border border-white/10 rounded-lg p-4">
      <label className="text-white/80 text-sm">Cliente</label>
      <div className="mt-2 flex gap-2">
        <select
          value={selectedCustomer || ""}
          onChange={(e) => setSelectedCustomer(e.target.value || null)}
          className="p-2 rounded bg-white/8 text-white w-full"
        >
          <option value="">Consumidor final</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.balance_usd ? `— Debe $${Number(c.balance_usd).toFixed(2)}` : ""}
            </option>
          ))}
        </select>

        {/* placeholder for a quick "Nuevo cliente" button (could open a dialog) */}
        <button className="px-3 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white">Nuevo</button>
      </div>
    </div>
  );
}
