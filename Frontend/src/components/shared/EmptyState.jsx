import React from "react";

export default function EmptyState({ title = "Nada por aquí", message = "No hay datos disponibles", action }) {
  return (
    <div className="bg-white rounded shadow p-6 text-center">
      <div className="text-3xl mb-3">—</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-500 mt-2">{message}</p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
