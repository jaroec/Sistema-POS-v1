import api from "./axiosClient";

export const fetchSalesRange = (start, end) => api.get("/reports/sales-range", { params: { start, end } }).then(r => r.data);
export const fetchTopProducts = (start, end) => api.get("/reports/top-products", { params: { start, end } }).then(r => r.data);
export const fetchCustomerStats = (start, end) => api.get("/reports/customers-stats", { params: { start, end } }).then(r => r.data);
export const fetchDashboardReport = (start, end) => api.get("/reports/dashboard", { params: { start, end } }).then(r => r.data);
export const exportSalesCSV = (start, end) => api.get("/reports/export/sales", { params: { start, end }, responseType: "blob" });
