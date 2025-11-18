import React, { useState, useMemo } from "react";

export default function SaleSummary({
  total,
  customers,
  paymentAccounts,
  onCreateSale,
  processing,
  error,
  exchangeRate
}) {
  const [customerId, setCustomerId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentAccountId, setPaymentAccountId] = useState(null);

  const totalVES = useMemo(() => {
    return exchangeRate ? total * exchangeRate : null;
  }, [total, exchangeRate]);

  return (
    <div className="bg-white rounded shadow p-4 space-y-4">
      <h3 className="font-semibold text-lg">Resumen</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>

        {totalVES !== null && (
          <div className="flex justify-between text-sm text-slate-600">
            VES:
            <span>{totalVES.toLocaleString("es-VE")}</span>
          </div>
        )}
      </div>

      {/* Cliente */}
      <div>
        <label className="block mb-1 text-sm text-slate-600">
          Cliente (opcional)
        </label>
        <select
          className="w-full border p-2 rounded"
          value={customerId || ""}
          onChange={(e) => setCustomerId(e.target.value || null)}
        >
          <option value="">Sin cliente</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Método de pago */}
      <div>
        <label className="block mb-1 text-sm text-slate-600">
          Método de pago
        </label>
        <select
          className="w-full border p-2 rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cash">Efectivo</option>
          <option value="card">Tarjeta</option>
          <option value="transfer">Transferencia</option>
          <option value="credit">Crédito</option>
        </select>
      </div>

      {/* Cuenta de pago */}
      {paymentMethod !== "credit" && (
        <div>
          <label className="block mb-1 text-sm text-slate-600">
            Cuenta de pago
          </label>

          <select
            className="w-full border p-2 rounded"
            value={paymentAccountId || ""}
            onChange={(e) => setPaymentAccountId(e.target.value || null)}
          >
            <option value="">Seleccione una cuenta</option>
            {paymentAccounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — ${a.balance ?? 0}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Botón */}
      <button
        disabled={processing || total <= 0 || (paymentMethod !== "credit" && !paymentAccountId)}
        onClick={() =>
          onCreateSale({
            customer_id: customerId,
            payment_method: paymentMethod,
            payment_account_id: paymentAccountId,
          })
        }
        className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        {processing ? "Procesando venta..." : "Finalizar venta"}
      </button>
    </div>
  );
}
