import { createContext, useState, useEffect } from "react";
import { backend } from "../api/backendClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar, verifica si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      backend.auth.me()
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ESTA es la función que falta
  const login = async (username, password) => {
    const response = await backend.auth.login({ username, password });
    localStorage.setItem("token", response.token);
    setUser(response.user);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-white">Cargando...</p>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
