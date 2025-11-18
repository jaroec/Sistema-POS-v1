import api from "./axiosClient";

export const getDayStats = () => api.get("/sales/stats/day").then(r => r.data);
export const getMonthStats = () => api.get("/sales/stats/month").then(r => r.data);
export const getLowStock = () => api.get("/products/low-stock").then(r => r.data);
export const getTopProducts = () => api.get("/sales/top-products").then(r => r.data);
export const getWeeklySales = () => api.get("/sales/stats/weekly").then(r => r.data);
export const getPaymentMethodStats = () => api.get("/payments/stats/methods").then(r => r.data);
export const getRecentSales = () => api.get("/sales/latest").then(r => r.data);
