import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded border">☰</button>
        <h1 className="text-lg font-semibold">Sistema POS</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 hidden sm:block">Cuenta: {user?.email ?? user?.name ?? "—"}</div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="px-3 py-1 border rounded text-sm hover:bg-red-50"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
