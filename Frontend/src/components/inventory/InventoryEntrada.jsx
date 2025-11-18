import React, { useState } from "react";
import { InventoryAPI } from "@/api/inventoryApi";
import { ProductsAPI } from "@/api/productsApi";

export default function InventoryEntrada() {
  const [products, setProducts] = useState([]);
  const [data, setData] = useState({
    product_id: "",
    quantity: "",
    description: "",
  });

  React.useEffect(() => {
    ProductsAPI.getAll().then(res => setProducts(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await InventoryAPI.addEntrada({
        ...data,
        quantity: Number(data.quantity),
        user_id: Number(localStorage.getItem("user_id")),
      });

      alert("Entrada registrada");
      setData({ product_id: "", quantity: "", description: "" });

    } catch (err) {
      alert("Error al registrar entrada");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Entrada de Inventario</h1>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={submit}>

        <select
          className="border p-2"
          value={data.product_id}
          onChange={(e) => setData({ ...data, product_id: e.target.value })}
          required
        >
          <option value="">Seleccione producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          className="border p-2"
          placeholder="Cantidad"
          value={data.quantity}
          onChange={(e) => setData({ ...data, quantity: e.target.value })}
          required
        />

        <input
          type="text"
          className="border p-2 md:col-span-3"
          placeholder="Descripción"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <button className="bg-blue-600 text-white p-2 rounded">Registrar</button>

      </form>
    </div>
  );
}
