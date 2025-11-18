// src/pages/users/UserForm.jsx

import { useState, useEffect } from "react";
import RolesSelector from "../../components/users/RolesSelector";

export default function UserForm({ onSubmit, initialData = {} }) {
  const [name, setName] = useState(initialData.name || "");
  const [username, setUsername] = useState(initialData.username || "");
  const [password, setPassword] = useState(""); // solo crear
  const [roles, setRoles] = useState(initialData.roles || []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { name, username, roles };
    if (!initialData.id) payload.password = password;

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-white space-y-4 max-w-lg"
    >
      <div>
        <label className="block mb-2">Nombre</label>
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-2">Usuario</label>
        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {!initialData.id && (
        <div>
          <label className="block mb-2">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label className="block mb-2">Roles</label>
        <RolesSelector value={roles} onChange={setRoles} />
      </div>

      <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700">
        Guardar
      </button>
    </form>
  );
}
