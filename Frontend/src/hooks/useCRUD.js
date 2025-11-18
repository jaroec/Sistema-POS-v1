import { useState } from "react";

export function useCRUD(api) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function call(fn, ...args) {
    setLoading(true);
    setError(null);

    try {
      const res = await fn(...args);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    list: () => call(api.list),
    get: (id) => call(api.get, id),
    create: (data) => call(api.create, data),
    update: (id, data) => call(api.update, id, data),
    remove: (id) => call(api.delete, id),
  };
}
