import { useState } from "react";
import { openCash } from "../../api/dailyCashApi";

export default function OpenCash({ reload }) {
  const [amount, setAmount] = useState("");

  const submit = async () => {
    await openCash(Number(amount));
    reload();
  };

  return (
    <div className="bg-white/10 border border-white/10 p-6 rounded-xl w-[350px]">

      <h2 className="text-xl font-semibold text-white mb-4">Abrir Caja</h2>

      <input
        className="w-full p-3 bg-white/10 border border-white/10 text-white rounded mb-3"
        placeholder="Monto inicial USD"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-emerald-600 hover:bg-emerald-700 w-full py-2 rounded text-white"
      >
        Abrir Caja
      </button>

    </div>
  );
}
