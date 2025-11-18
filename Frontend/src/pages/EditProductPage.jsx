// src/pages/EditProductPage.jsx
import React, { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import ProductForm from "../components/products/ProductForm";
import { getProductById, updateProduct } from "../api/productsApi";
import api from "../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProductPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [formData, setFormData] = useState(null);
  const [rate, setRate] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProductById(id);
        setFormData({
          product_code: p.product_code,
          name: p.name,
          description: p.description,
          category: p.category,
          cost_usd: Number(p.cost_usd || 0),
          profit_percent: Number(p.profit_percent || 0),
          sale_price_usd: Number(p.sale_price_usd || 0),
          sale_price_ves: Number(p.sale_price_ves || 0),
          stock: Number(p.stock || 0),
          min_stock: Number(p.min_stock || 0),
        });

        const res = await api.get("/exchange-rates/active");
        const rateValue = res.data.rate_usd_to_ves ?? res.data.rate ?? 1;
        setRate(Number(rateValue));
      } catch (err) {
        console.error(err);
        alert("Error cargando producto");
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, {
        ...formData,
        cost_usd: Number(formData.cost_usd || 0),
        profit_percent: Number(formData.profit_percent || 0),
        sale_price_usd: Number(formData.sale_price_usd || 0),
        sale_price_ves: Number(formData.sale_price_ves || 0),
        stock: Number(formData.stock || 0),
        min_stock: Number(formData.min_stock || 0),
      });
      alert("Producto actualizado");
      nav("/products");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error actualizando producto");
    }
  };

  if (!formData) return <AppLayout> Cargando…</AppLayout>;

  return (
    <AppLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Editar producto</h1>

        <ProductForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} rate={rate} />
      </div>
    </AppLayout>
  );
}
