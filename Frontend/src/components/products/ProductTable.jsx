// src/components/products/ProductTable.jsx
import React from "react";

export default function ProductTable({ products = [], onEdit = () => {}, onDelete = () => {} }) {
  return (
    <div className="bg-white/6 backdrop-blur-md border border-white/10 rounded-xl overflow-auto">
      <table className="w-full min-w-[700px]">
        <thead className="text-left text-white/80 bg-white/4">
          <tr>
            <th className="p-3">Código</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Categoría</th>
            <th className="p-3 text-center">Costo USD</th>
            <th className="p-3 text-center">% Gan.</th>
            <th className="p-3 text-center">Precio USD</th>
            <th className="p-3 text-center">Precio VES</th>
            <th className="p-3 text-center">Stock</th>
            <th className="p-3 text-center">Min Stock</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="10" className="p-6 text-center text-white/70">No hay productos</td>
            </tr>
          )}

          {products.map((p) => (
            <tr key={p.id} className="border-t border-white/6 hover:bg-white/4">
              <td className="p-3">{p.product_code}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.category}</td>
              <td className="p-3 text-center">${Number(p.cost_usd).toFixed(2)}</td>
              <td className="p-3 text-center">{Number(p.profit_percent).toFixed(2)}%</td>
              <td className="p-3 text-center font-semibold">${Number(p.sale_price_usd).toFixed(2)}</td>
              <td className="p-3 text-center">{Number(p.sale_price_ves).toLocaleString()}</td>
              <td className={`p-3 text-center ${p.stock <= p.min_stock ? "text-red-400 font-bold" : ""}`}>{p.stock}</td>
              <td className="p-3 text-center">{p.min_stock}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => onEdit(p.id)}
                  className="mr-2 px-2 py-1 rounded bg-sky-600 text-white text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="px-2 py-1 rounded bg-red-600 text-white text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
