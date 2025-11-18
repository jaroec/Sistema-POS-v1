import React, { useEffect, useState } from "react";
import { InventoryAPI } from "@/api/inventoryApi";
import { ProductsAPI } from "@/api/productsApi";

export default function Kardex() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  const [productId, setProductId] = useState("");

  const load = async () => {
    if (!productId) return;
    const res = await InventoryAPI.getKardex(productId);
    setMovements(res.data);
  };

  useEffect(() => {
    ProductsAPI.getAll().then(res => setProducts(res.data));
  }, []);

  useEffect(() => {
    load();
  }, [productId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Kardex del Producto</h1>

      <select
        className="border p-2 mb-4"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option value="">Seleccione producto</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {productId && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Cantidad</th>
              <th className="p-2 border">Anterior</th>
              <th className="p-2 border">Nuevo</th>
              <th className="p-2 border">Descripción</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border">
                <td className="p-2 border">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="p-2 border uppercase">{m.type}</td>
                <td className="p-2 border">{m.quantity}</td>
                <td className="p-2 border">{m.previous_stock}</td>
                <td className="p-2 border">{m.new_stock}</td>
                <td className="p-2 border">{m.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

