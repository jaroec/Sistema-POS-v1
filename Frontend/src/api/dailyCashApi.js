import api from "./backendClient";

export const getCurrentCash = () =>
  api.get("/daily-cash/current").then((r) => r.data);

export const openCash = (amount) =>
  api.post("/daily-cash/open", { opening_amount_usd: amount }).then((r) => r.data);

export const closeCash = (id) =>
  api.post(`/daily-cash/close/${id}`).then((r) => r.data);

export const listCash = () =>
  api.get("/daily-cash").then((r) => r.data);
