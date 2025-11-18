import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return {
    user: ctx.user,
    token: ctx.token,
    login: ctx.login,
    logout: ctx.logout,
    isAuthenticated: Boolean(ctx.token),
  };
}
