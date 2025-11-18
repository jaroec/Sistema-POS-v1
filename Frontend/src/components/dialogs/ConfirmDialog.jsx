import React from "react";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-[380px] shadow">
        <h3 className="font-bold text-lg mb-3">Confirmar</h3>

        <p className="text-sm mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-1 border rounded">
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-1 bg-red-600 text-white rounded"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
