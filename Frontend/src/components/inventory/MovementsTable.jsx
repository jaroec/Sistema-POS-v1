// src/components/inventory/MovementsTable.jsx
export default function MovementsTable({ movements = [] }) {
  return (
    <div className="bg-white/10 p-4 rounded-xl border border-white/10 overflow-auto">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="p-2">Fecha</th>
            <th className="p-2">Producto</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Anterior</th>
            <th className="p-2">Nuevo</th>
            <th className="p-2">Referencia</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Usuario</th>
          </tr>
        </thead>

        <tbody>
          {movements.map((m) => (
            <tr key={m.id} className="border-b border-white/6">
              <td className="p-2">{new Date(m.createdAt).toLocaleString()}</td>
              <td className="p-2">
                {m.Product ? `${m.Product.product_code} — ${m.Product.name}` : m.product_id}
              </td>
              <td className="p-2">{m.type}</td>
              <td className="p-2">{m.quantity}</td>
              <td className="p-2">{m.previous_stock}</td>
              <td className="p-2">{m.new_stock}</td>
              <td className="p-2">{m.reference ?? "-"}</td>
              <td className="p-2">{m.description ?? "-"}</td>
              <td className="p-2">{m.user_id ?? "-"}</td>
            </tr>
          ))}

          {movements.length === 0 && (
            <tr>
              <td colSpan="9" className="p-4 text-center text-white/60">No hay movimientos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
