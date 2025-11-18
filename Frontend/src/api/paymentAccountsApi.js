// src/api/inventoryApi.js
import api from "./axiosClient";

export const createMovement = (payload) => api.post("/inventory/movements", payload).then(r => r.data);
export const listMovements = (productId, limit = 200) => api.get("/inventory/movements", { params: { productId, limit } }).then(r => r.data);
export const getKardex = (productId) => api.get(`/inventory/kardex/${productId}`).then(r => r.data);
