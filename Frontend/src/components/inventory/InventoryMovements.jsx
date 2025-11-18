import React, { useEffect, useState } from "react";
import { InventoryAPI } from "@/api/inventoryApi";

export default function InventoryMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await InventoryAPI.getMovements();
      setMovements(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Movimientos de Inventario</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Producto</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Cantidad</th>
            <th className="p-2 border">Stock Anterior</th>
            <th className="p-2 border">Nuevo Stock</th>
            <th className="p-2 border">Referencia</th>
          </tr>
        </thead>

        <tbody>
          {movements.map((m) => (
            <tr key={m.id} className="border">
              <td className="p-2 border">
                {new Date(m.createdAt).toLocaleString()}
              </td>
              <td className="p-2 border">{m.Product?.name}</td>
              <td className="p-2 border uppercase">{m.type}</td>
              <td className="p-2 border">{m.quantity}</td>
              <td className="p-2 border">{m.previous_stock}</td>
              <td className="p-2 border">{m.new_stock}</td>
              <td className="p-2 border">{m.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
