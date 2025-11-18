import React, { useEffect, useState } from "react";
import Layout from "../components/layout/AppLayout";
import { backend } from "../api/backendClient";
import Loader from "../components/shared/Loader";
import SaleDetailsDialog from "../components/dialogs/SaleDetailsDialog";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const list = await backend.sales.list();
        if (!mounted) return;
        setSales(list || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Ventas</h2>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left">Código</th>
                  <th className="p-3 text-left">Cliente</th>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sales.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3">{s.sale_code ?? s.code ?? s.id}</td>
                    <td className="p-3">{s.customer_name ?? s.customer?.name ?? "—"}</td>
                    <td className="p-3">{new Date(s.sale_date || s.created_at || s.created_date).toLocaleString()}</td>
                    <td className="p-3 text-right">${(s.total ?? s.total_usd ?? 0).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelected(s)}
                        className="px-3 py-1 bg-sky-600 text-white rounded"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <SaleDetailsDialog sale={selected} onClose={() => setSelected(null)} />
      </div>
    </Layout>
  );
}
