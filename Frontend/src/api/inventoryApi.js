import api from "@/api/axiosClient";

export const getMovements = () => api.get("/inventory/movements");
export const getKardex = (productId) => api.get(`/inventory/product/${productId}`);

export const createMovement = (data) => api.post("/inventory/entrada", data); // si esta es entrada
export const addEntrada = (data) => api.post("/inventory/entrada", data);
export const addSalida = (data) => api.post("/inventory/salida", data);
export const addAjuste = (data) => api.post("/inventory/ajuste", data);
export const listMovements = () => api.get("/inventory/movements");
