import React from "react";

/**
 * Card: envuelve contenido con glass style
 * Props: title, subtitle, className
 */
export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <div className={`bg-white/6 backdrop-blur-md border border-white/8 rounded-xl p-4 ${className}`}>
      {title && (
        <div className="mb-2">
          <div className="text-sm text-white/80">{title}</div>
          {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
