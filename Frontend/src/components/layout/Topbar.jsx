import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white/6 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded bg-white/5">☰</button>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-md object-cover" />
          <div>
            <div className="text-white font-bold">Mi POS</div>
            <div className="text-xs text-white/70">Gestión • Ventas • Inventario</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-white/80 hidden sm:block">Usuario: {user?.name ?? user?.username ?? "—"}</div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded bg-white/6 hover:bg-white/10 text-white text-sm" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
