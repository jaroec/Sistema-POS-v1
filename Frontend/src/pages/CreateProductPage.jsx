// src/pages/CreateProductPage.jsx
import React, { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import ProductForm from "../components/products/ProductForm";
import { createProduct } from "../api/productsApi";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function CreateProductPage() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    product_code: "",
    name: "",
    description: "",
    category: "",
    cost_usd: 0,
    profit_percent: 30,
    sale_price_usd: 0,
    sale_price_ves: 0,
    stock: 0,
    min_stock: 0,
  });

  const [rate, setRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(true);

  useEffect(() => {
    async function loadRate() {
      try {
        setLoadingRate(true);
        const res = await api.get("/exchange-rates/active");
        // backend's model used: rate_usd_to_ves or rate; adjust
        const rateValue = res.data.rate_usd_to_ves ?? res.data.rate ?? res.data.rate_usd_to_ves;
        setRate(Number(rateValue || 1));
      } catch (err) {
        console.warn("No se pudo obtener tasa activa", err);
        setRate(1);
      } finally {
        setLoadingRate(false);
      }
    }
    loadRate();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ensure numeric types
      const payload = {
        ...formData,
        cost_usd: Number(formData.cost_usd || 0),
        profit_percent: Number(formData.profit_percent || 0),
        sale_price_usd: Number(formData.sale_price_usd || 0),
        sale_price_ves: Number(formData.sale_price_ves || 0),
        stock: Number(formData.stock || 0),
        min_stock: Number(formData.min_stock || 0),
      };

      await createProduct(payload);
      alert("Producto creado");
      nav("/products");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creando producto");
    }
  };

  return (
    <AppLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Nuevo producto</h1>

        <ProductForm formData={formData} setFormData={(fd) => {
          // product form calculates sale_price_usd and sale_price_ves using rate prop
          setFormData(fd);
        }} onSubmit={handleSubmit} rate={rate} />
      </div>
    </AppLayout>
  );
}
