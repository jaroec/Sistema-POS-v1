import React, { useEffect, useState } from "react";
import { backend } from "../../api/backendClient";

export default function SaleDetailsDialog({ sale, onClose }) {
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    async function loadRate() {
      try {
        const rates = await backend.exchangeRates.list();
        if (rates && rates.length > 0) {
          setExchangeRate(rates[0].rate_usd_to_ves ?? 1);
        }
      } catch {}
    }
    loadRate();
  }, []);

  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded w-full max-w-2xl max-h-[90vh] overflow-auto shadow">
        <h2 className="text-xl font-bold mb-4 flex justify-between">
          Detalles de Venta
          <button className="text-red-600" onClick={onClose}>✕</button>
        </h2>

        {/* Datos principales */}
        <div className="bg-slate-50 p-4 rounded mb-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Código</p>
            <p className="font-semibold">{sale.sale_code}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Fecha</p>
            <p className="font-semibold">
              {new Date(sale.sale_date || sale.created_date).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Cliente</p>
            <p className="font-semibold">{sale.customer_name || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Estado</p>
            <p className="font-semibold">{sale.status}</p>
          </div>
        </div>

        {/* Productos */}
        <h3 className="font-semibold text-lg mb-2">Productos</h3>
        <div className="border rounded mb-4 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 text-sm">
              <tr>
                <th className="p-2 text-left">Producto</th>
                <th className="p-2 text-center">Cant</th>
                <th className="p-2 text-right">Precio USD</th>
                <th className="p-2 text-right">Subtotal USD</th>
                <th className="p-2 text-right">Subtotal VES</th>
              </tr>
            </thead>
            <tbody>
              {sale.items?.map((i, idx) => {
                const sub = i.subtotal ?? 0;
                return (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{i.product_name}</td>
                    <td className="p-2 text-center">{i.quantity}</td>
                    <td className="p-2 text-right">${i.unit_price?.toFixed(2)}</td>
                    <td className="p-2 text-right">${sub.toFixed(2)}</td>
                    <td className="p-2 text-right">
                      {(sub * exchangeRate).toLocaleString("es-VE")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <h3 className="font-semibold text-lg mb-2">Totales</h3>
        <div className="bg-slate-50 p-4 rounded space-y-2">
          <div className="flex justify-between">
            <span>Subtotal USD:</span>
            <span className="font-semibold">${sale.subtotal?.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Total USD:</span>
            <span className="font-bold text-emerald-700">${sale.total?.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Total VES:</span>
            <span className="font-semibold">
              {(sale.total * exchangeRate).toLocaleString("es-VE")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Pagado:</span>
            <span className="font-semibold text-blue-600">${sale.paid_amount?.toFixed(2)}</span>
          </div>

          {sale.balance > 0 && (
            <div className="flex justify-between text-orange-700 font-semibold">
              <span>Balance:</span>
              <span>${sale.balance.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Notas */}
        {sale.notes && (
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Notas</h3>
            <p className="bg-slate-100 p-3 rounded text-sm">{sale.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
