const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    credentials: "include",
  };

  if (options.body) config.body = JSON.stringify(options.body);

  const res = await fetch(`${API_URL}${path}`, config);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Error en el servidor");
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

const createEntity = (endpoint) => ({
  list: () => request(`/${endpoint}`),
  get: (id) => request(`/${endpoint}/${id}`),
  create: (data) => request(`/${endpoint}`, { method: "POST", body: data }),
  update: (id, data) => request(`/${endpoint}/${id}`, { method: "PUT", body: data }),
  delete: (id) => request(`/${endpoint}/${id}`, { method: "DELETE" }),
});

export const backend = {
  auth: {
    login: (data) => request("/auth/login", { method: "POST", body: data }),
    me: () => request("/auth/me"),
    logout: () => request("/auth/logout", { method: "POST" }),
  },

  users: createEntity("users"),
  products: createEntity("products"),
  customers: createEntity("customers"),
  sales: createEntity("sales"),
  exchangeRates: createEntity("exchangeRates"),
  paymentAccounts: createEntity("paymentAccounts"),
  payments: createEntity("payments"),
};
