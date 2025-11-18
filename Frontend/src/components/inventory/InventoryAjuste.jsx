import React, { useState } from "react";
import { InventoryAPI } from "@/api/inventoryApi";
import { ProductsAPI } from "@/api/productsApi";

export default function InventoryAjuste() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [newStock, setNewStock] = useState("");

  React.useEffect(() => {
    ProductsAPI.getAll().then(res => setProducts(res.data));
  }, []);

  const loadProduct = (id) => {
    const p = products.find(x => x.id == id);
    setProduct(p);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await InventoryAPI.addAjuste({
        product_id: product.id,
        new_stock: Number(newStock),
        description: "Ajuste de stock",
        user_id: Number(localStorage.getItem("user_id")),
      });

      alert("Ajuste realizado");
      setNewStock("");
      setProduct(null);
    } catch (err) {
      alert("Error en ajuste");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Ajuste de Inventario</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <select
          className="border p-2"
          onChange={(e) => loadProduct(e.target.value)}
        >
          <option value="">Seleccione producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {product && (
          <p className="p-2 bg-gray-100 rounded">
            Stock actual: <b>{product.stock}</b>
          </p>
        )}

        {product && (
          <input
            type="number"
            className="border p-2"
            placeholder="Nuevo stock"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
          />
        )}

        {product && (
          <button
            onClick={submit}
            className="bg-blue-600 text-white p-2 rounded col-span-1"
          >
            Ajustar
          </button>
        )}
      </div>
    </div>
  );
}
