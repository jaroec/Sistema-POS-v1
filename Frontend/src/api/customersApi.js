import api from "./axiosClient";

// LISTAR
export const fetchCustomers = async (search = "") => {
  const res = await api.get("/customers", { params: { search } });
  return res.data.items;
};

// CREAR
export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res.data;
};

// EDITAR
export const updateCustomer = async (id, data) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};

// ELIMINAR
export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};

// HISTORIAL DE COMPRAS
export const fetchCustomerHistory = async (id) => {
  const res = await api.get(`/customers/${id}/sales`);
  return res.data.items;
};

// DEUDAS PENDIENTES
export const fetchCustomerDebts = async (id) => {
  const res = await api.get(`/customers/${id}/debts`);
  return res.data.items;
};

// ABONAR
export const payCustomerDebt = async (saleId, amount) => {
  const res = await api.post(`/sales/${saleId}/pay`, { amount });
  return res.data;
};
