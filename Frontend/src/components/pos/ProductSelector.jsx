import React, { useState, useMemo } from "react";

export default function ProductSelector({ products, exchangeRate = null, onAdd }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.code || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Productos</h3>
        <input
          type="text"
          value={search}
          placeholder="Buscar..."
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-60"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-auto">
        {filtered.map((p) => {
          const priceUSD = p.sale_price_usd ?? 0;
          const priceVES = exchangeRate ? priceUSD * exchangeRate : null;

          return (
            <button
              key={p.id}
              onClick={() => onAdd(p, 1)}
              className="border p-3 rounded hover:bg-slate-50 text-left"
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-slate-500">{p.code}</p>

              <p className="text-sm mt-2">
                USD: <span className="font-bold">${priceUSD.toFixed(2)}</span>
              </p>

              {priceVES !== null && (
                <p className="text-xs text-slate-600">
                  VES: {(priceVES).toLocaleString("es-VE")}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
