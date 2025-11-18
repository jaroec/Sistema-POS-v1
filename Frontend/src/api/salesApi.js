// src/api/salesApi.js
import api from "@/api/axiosClient";

export const SalesAPI = {
  create(data) {
    return api.post("/sales", data);
  },

  getAll(params) {
    return api.get("/sales", { params });
  },

  getById(id) {
    return api.get(`/sales/${id}`);
  },

  cancel(id) {
    return api.put(`/sales/${id}/cancel`);
  },

  // Reportes
  getDaily() {
    return api.get("/sales/report/day");
  },

  getMonthly() {
    return api.get("/sales/report/month");
  },

  getTotals() {
    return api.get("/sales/report/totals");
  },

  getTopProducts() {
    return api.get("/sales/report/top-products");
  },

  getTopCustomers() {
    return api.get("/sales/report/top-customers");
  },
};

export const searchProducts = (query) => {
  return api.get(`/products/search?q=${query}`);
};

export const fetchCustomers = () => {
  return api.get("/customers");
};

export const createSale = (data) => {
  return api.post("/sales", data);
};

export const fetchExchangeRate = () => {
  return api.get("/exchange-rate");
};

export const fetchPaymentAccounts = () => {
  return api.get("/bank/accounts");
};
