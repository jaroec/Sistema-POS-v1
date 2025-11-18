import { useState } from "react";

export default function PaymentModal({
  totalUSD,
  totalVES,
  rate,
  accounts,
  close,
  submit,
}) {
  const [payments, setPayments] = useState([]);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");

  const addPayment = () => {
    if (!method || !amount) return;

    setPayments([
      ...payments,
      {
        method,
        amount: Number(amount),
      },
    ]);

    setMethod("");
    setAmount("");
  };

  const totalPaid = payments.reduce((a, p) => a + p.amount, 0);
  const pending = totalUSD - totalPaid;

  const finish = () => {
    if (totalPaid <= 0) {
      alert("Debe registrar al menos un pago.");
      return;
    }
    submit(payments);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-[450px] border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">
          Registrar Pago
        </h2>

        <p className="text-white mb-1">
          Total: <span className="text-emerald-400">${totalUSD.toFixed(2)}</span>
        </p>

        <p className="text-white/60 mb-3">
          Total VES: {totalVES.toFixed(2)}
        </p>

        {/* MÉTODO */}
        <label className="text-white/70 text-sm">Método</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-2 bg-white/10 border border-white/10 text-white rounded mt-1"
        >
          <option value="">Seleccionar</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
          <option value="Crédito">Crédito (Cuenta Pendiente)</option>
        </select>

        {/* MONTO */}
        <label className="text-white/70 text-sm mt-3">Monto (USD)</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 bg-white/10 border border-white/10 text-white rounded mt-1"
        />

        <button
          onClick={addPayment}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 mt-3 rounded"
        >
          Agregar Pago
        </button>

        {/* LISTA DE PAGOS */}
        {payments.length > 0 && (
          <div className="mt-4 space-y-2">
            {payments.map((p, i) => (
              <div
                key={i}
                className="bg-white/10 p-3 rounded flex justify-between text-sm text-white"
              >
                <span>{p.method}</span>
                <span>${p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-white">
          <p>Total Pagado: ${totalPaid.toFixed(2)}</p>
          <p className="text-white/60">
            Pendiente: ${pending.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={finish}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded"
          >
            Finalizar Venta
          </button>

          <button
            onClick={close}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
