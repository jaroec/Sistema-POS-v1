import { closeCash } from "../../api/dailyCashApi";

export default function CloseCash({ cash, reload }) {
  
  const submit = async () => {
    await closeCash(cash.id);
    reload();
  };

  return (
    <div className="bg-white/10 border border-white/10 p-6 rounded-xl">

      <h2 className="text-xl font-semibold text-white mb-3">Caja Abierta</h2>

      <p className="text-white/70 mb-4">
        Monto inicial: <span className="text-emerald-400">${cash.opening_amount_usd}</span>
      </p>

      <button
        onClick={submit}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Cerrar Caja
      </button>

    </div>
  );
}
