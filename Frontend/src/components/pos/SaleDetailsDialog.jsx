import { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function SaleDetailsDialog({ saleId, onClose }) {
  const [sale, setSale] = useState(null);

  useEffect(() => {
    if (!saleId) return;

    api.get(`/sales/${saleId}`).then((res) => setSale(res.data));
  }, [saleId]);

  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-[700px] border border-white/10">
        
        <h2 className="text-xl font-semibold text-white mb-4">
          Venta #{sale.sale_code}
        </h2>

        <p className="text-sm text-white/60 mb-4">
          Fecha: {new Date(sale.sale_date).toLocaleString()}
        </p>

        <h3 className="text-lg font-semibold text-white mb-3">
          Productos
        </h3>

        <div className="space-y-2">
          {sale.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between bg-white/5 p-3 rounded"
            >
              <div>
                <p className="text-white font-semibold">{item.name}</p>
                <p className="text-white/40 text-xs">{item.product_code}</p>
              </div>

              <p className="text-white/80">
                {item.quantity} x ${item.price_usd}
              </p>

              <p className="text-emerald-400 font-bold">
                ${(item.price_usd * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-white text-xl font-bold">
          Total: ${sale.total_usd.toFixed(2)}
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 p-3 rounded text-white font-semibold"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
