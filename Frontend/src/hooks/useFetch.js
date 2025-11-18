import { useState, useEffect } from "react";

export function useFetch(asyncCallback, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const response = await asyncCallback();
      setData(response);
    } catch (err) {
      setError(err);
      console.error("useFetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, deps);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}
