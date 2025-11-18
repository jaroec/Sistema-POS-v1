import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.username, form.password);
      window.location.href = "/";
    } catch (err) {
      alert("Credenciales incorrectas");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex justify-center items-center p-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8">
        
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Iniciar Sesión
        </h2>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="text-white/80 text-sm">Usuario</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-white/80 text-sm">Contraseña</label>
            <input
              type="password"
              className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
