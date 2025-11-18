import React, { useState } from "react";
import { ProductsAPI } from "@/api/productsApi";

export default function ProductSearch({ onAdd }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    if (e.key !== "Enter") return;

    setLoading(true);

    try {
      const res = await ProductsAPI.searchByCode(code);

      if (!res.data) {
        alert("Producto no encontrado");
        return;
      }

      const p = res.data;

      if (p.stock <= 0) {
        alert("NO HAY STOCK DISPONIBLE");
        return;
      }

      onAdd({
        product_id: p.id,
        name: p.name,
        quantity: 1,
        price_usd: parseFloat(p.sale_price_usd),
        stock: p.stock,
      });

      setCode("");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={search}
        placeholder="Código del producto"
        className="border p-3 w-full text-lg"
      />
    </div>
  );
}
