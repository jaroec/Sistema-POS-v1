import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { backend } from "../api/backendClient";
import Loader from "../components/shared/Loader";

export default function PaymentAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const list = await backend.paymentAccounts.list();
      setAccounts(list || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Cuentas de Pago</h2>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {accounts.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded shadow">
                <p className="text-sm text-slate-500">{a.name}</p>
                <p className="text-lg font-semibold">${(a.balance ?? 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
