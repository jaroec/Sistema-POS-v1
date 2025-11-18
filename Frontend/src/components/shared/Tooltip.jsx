import React from "react";

export default function Tooltip({ text, children }) {
  return (
    <div className="relative group inline-block">
      {children}
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-2 py-1 rounded pointer-events-none">
        {text}
      </span>
    </div>
  );
}
