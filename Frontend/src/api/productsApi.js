// src/api/productsApi.js
import api from "./axiosClient";

export const getProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (payload) => {
  const res = await api.post("/products", payload);
  return res.data;
};

export const updateProduct = async (id, payload) => {
  const res = await api.put(`/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// Stats
export const getTopSelling = async () => {
  const res = await api.get("/products/stats/top-selling");
  return res.data;
};

export const getLowStock = async () => {
  const res = await api.get("/products/stats/low-stock");
  return res.data;
};

// Test / fallback
export const fetchProducts = async () => {
  const res = await fetch("/api/products");
  return res.json();
};

// 🔥 Agregamos el objeto que tu componente espera
export const ProductsAPI = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopSelling,
  getLowStock,
  fetchProducts,
};
