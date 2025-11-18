import React from "react";

export default function IconButton({ icon, onClick, variant = "default", size = 36, title }) {
  const styles = {
    default: "bg-slate-100 hover:bg-slate-200 border",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded flex items-center justify-center ${styles[variant]}`}
      style={{ width: size, height: size }}
      title={title}
    >
      {icon}
    </button>
  );
}
