import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", emoji: "📊" },
  { to: "/pos", label: "POS", emoji: "🛒" },
  { to: "/ventas", label: "Ventas", emoji: "💳" },
  { to: "/productos", label: "Productos", emoji: "📦" },
  { to: "/clientes", label: "Clientes", emoji: "👥" },
  { to: "/inventario", label: "Inventario", emoji: "📦" },
  { to: "/pagos", label: "Pagos", emoji: "🏦" },
  { to: "/tasas", label: "Tasas", emoji: "💱" },
  { to: "/usuarios", label: "Usuarios", emoji: "🔐" },
  { to: "/config", label: "Ajustes", emoji: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 hidden md:flex flex-col gap-4 p-4 bg-gradient-to-b from-slate-900/40 to-slate-900/30 border-r border-white/6 backdrop-blur-sm">
      <div className="mb-4">
        <img src="/logo.png" alt="logo" className="w-40 mx-auto" />
      </div>

      <nav className="flex-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-white/90 hover:bg-white/6 ${
                isActive ? "bg-emerald-600/30 font-semibold" : ""
              }`
            }
          >
            <span className="text-lg">{l.emoji}</span>
            <span className="text-sm">{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="text-xs text-white/60">
        <div>Versión 1.0.0</div>
        <div className="mt-2">Conectado</div>
      </div>
    </aside>
  );
}
