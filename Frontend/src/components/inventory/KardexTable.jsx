// src/components/inventory/KardexTable.jsx
export default function KardexTable({ entries = [] }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-auto">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-2">Fecha</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Entrada</th>
            <th className="p-2">Salida</th>
            <th className="p-2">Balance</th>
            <th className="p-2">Referencia</th>
            <th className="p-2">Nota</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-white/6">
              <td className="p-2">{new Date(e.date).toLocaleString()}</td>
              <td className="p-2">{e.type}</td>
              <td className="p-2">{(e.type === "in" || e.type === "adjustment") ? e.quantity : "-"}</td>
              <td className="p-2">{e.type === "out" ? e.quantity : "-"}</td>
              <td className="p-2">{e.balance}</td>
              <td className="p-2">{e.reference ?? "-"}</td>
              <td className="p-2">{e.note ?? "-"}</td>
            </tr>
          ))}

          {entries.length === 0 && (
            <tr>
              <td colSpan="7" className="p-4 text-center text-white/60">Sin movimientos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
