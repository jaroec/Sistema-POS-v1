import React from "react";

export default function Loader({ size = 40, text = "Cargando..." }) {
  const s = typeof size === "number" ? `${size}px` : size;
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        style={{ width: s, height: s }}
        className="animate-spin rounded-full border-4 border-t-transparent border-slate-300"
      />
      {text && <p className="mt-3 text-sm text-slate-600">{text}</p>}
    </div>
  );
}
