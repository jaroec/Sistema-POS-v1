import React from "react";

export default function ModalBase({ open, onClose, width = "480px", children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded shadow p-6 max-h-[90vh] overflow-auto"
        style={{ width }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600 text-xl"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
