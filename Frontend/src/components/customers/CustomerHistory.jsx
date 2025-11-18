import { useEffect, useState } from "react";
import { fetchCustomerHistory } from "../../api/customersApi";

export default function CustomerHistory({ customer, close }) {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchCustomerHistory(customer.id).then(setSales);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 w-[600px] rounded-xl border border-white/10">

        <h2 className="text-xl text-white mb-4">
          Historial de {customer.name}
        </h2>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sales.map((s) => (
            <div
              key={s.id}
              className="bg-white/5 p-3 rounded border border-white/10 flex justify-between"
            >
              <span className="text-white">{s.sale_code}</span>
              <span className="text-white/60">
                {new Date(s.sale_date).toLocaleString()}
              </span>
              <span className="text-emerald-400 font-bold">${s.total_usd}</span>
            </div>
          ))}
        </div>

        <button
          onClick={close}
          className="w-full mt-4 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
