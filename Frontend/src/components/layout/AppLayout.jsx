import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * AppLayout envuelve páginas privadas. Usa Tailwind.
 * Uso:
 * <AppLayout>
 *   ...contenido...
 * </AppLayout>
 */
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
