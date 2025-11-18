import { useEffect, useState } from "react";
import {
  fetchCustomerDebts,
  payCustomerDebt,
} from "../../api/customersApi";

export default function CustomerDebtModal({ customer, close }) {
  const [debts, setDebts] = useState([]);
  const [amount, setAmount] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);

  useEffect(() => {
    fetchCustomerDebts(customer.id).then(setDebts);
  }, []);

  const pay = async () => {
    if (!selectedSale || !amount) {
      alert("Selecciona una deuda y un monto");
      return;
    }

    await payCustomerDebt(selectedSale, Number(amount));
    const newDebts = await fetchCustomerDebts(customer.id);
    setDebts(newDebts);
    setAmount("");
    alert("Pago registrado");
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 w-[600px] rounded-xl border border-white/10">

        <h2 className="text-xl text-white mb-4">
          Deudas de {customer.name}
        </h2>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {debts.map((d) => (
            <button
              key={d.sale_id}
              onClick={() => setSelectedSale(d.sale_id)}
              className={`w-full text-left p-3 rounded border ${
                selectedSale === d.sale_id
                  ? "bg-white/20 border-white/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <p className="text-white font-semibold">
                Venta {d.sale_code}
              </p>
              <p className="text-yellow-300">
                Pendiente: ${d.balance}
              </p>
            </button>
          ))}
        </div>

        {/* ABONO */}
        <div className="mt-3">
          <input
            placeholder="Monto a pagar"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mt-2 bg-white/10 border border-white/10 rounded text-white"
          />

          <button
            onClick={pay}
            className="w-full bg-emerald-600 hover:bg-emerald-700 mt-3 p-2 rounded text-white"
          >
            Registrar Abono
          </button>
        </div>

        <button
          onClick={close}
          className="w-full mt-4 p-3 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
