import React from "react";

export default function Input({ value, onChange, placeholder = "", type = "text", className = "", ...rest }) {
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className={`w-full p-2 rounded-lg bg-white/8 border border-white/10 text-white ${className}`}
      {...rest}
    />
  );
}
