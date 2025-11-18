import React from "react";
import Layout from "../components/layout/Layout";

export default function Settings() {
  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold mb-4">Ajustes</h2>
        <div className="bg-white rounded shadow p-4">
          <p className="text-slate-600">Aquí puedes agregar configuración del sistema.</p>
          <ul className="mt-4 list-disc list-inside text-sm text-slate-700">
            <li>Configuración de caja</li>
            <li>Opciones de moneda y tasas</li>
            <li>Permisos de usuarios</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
