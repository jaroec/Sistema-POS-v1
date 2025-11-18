import { useEffect, useState } from "react";
import AppLayout from "../components/layout/LppLayout";
import { getCurrentCash, openCash, closeCash, listCash } from "../api/dailyCashApi";
import OpenCash from "../components/dailycash/OpenCash";
import CloseCash from "../components/dailycash/CloseCash";
import CashStatus from "../components/dailycash/CashStatus";

export default function DailyCashPage() {
  const [cash, setCash] = useState(null);
  const [history, setHistory] = useState([]);

  const load = async () => {
    setCash(await getCurrentCash());
    setHistory(await listCash());
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AppLayout>
      <div className="text-white">

        <h1 className="text-2xl font-bold mb-6">Caja Diaria</h1>

        {/* Estado actual */}
        <CashStatus cash={cash} reload={load} />

        {/* Historial */}
        <h2 className="text-xl mt-8 mb-3 font-semibold">Historial</h2>

        <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Inicial</th>
                <th className="p-3">Ventas Contado</th>
                <th className="p-3">Pagos</th>
                <th className="p-3">Cierre</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>

            <tbody>
              {history.map((d) => (
                <tr key={d.id} className="border-b border-white/5">
                  <td className="p-3">{d.opening_date}</td>
                  <td className="p-3">${d.opening_amount_usd}</td>
                  <td className="p-3">${d.total_sales_cash_usd}</td>
                  <td className="p-3">${d.total_payments_received_usd}</td>
                  <td className="p-3">${d.closing_amount_usd}</td>
                  <td className="p-3">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AppLayout>
  );
}
