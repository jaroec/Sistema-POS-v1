// src/api/usersApi.js
import api from "./api";

export const getUsers = async (params = {}) => {
  const res = await api.get("/users", { params });
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const toggleActiveUser = async (id) => {
  const res = await api.put(`/users/${id}/toggle-active`);
  return res.data;
};

export const changeOwnPassword = async (data) => {
  const res = await api.put("/users/change-password/self", data);
  return res.data;
};
