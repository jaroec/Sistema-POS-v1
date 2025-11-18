import React from "react";

/**
 * Button base, variants: primary, danger, ghost
 */
export default function Button({ children, onClick, variant = "primary", className = "", ...rest }) {
  const styles = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "bg-white/6 hover:bg-white/10 text-white border border-white/6",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
