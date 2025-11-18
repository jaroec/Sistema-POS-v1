// src/components/users/UsersTable.jsx
import { Link } from "react-router-dom";

export default function UsersTable({ users, onToggleActive }) {
  return (
    <table className="w-full border border-gray-700 bg-gray-900 text-white rounded-lg">
      <thead>
        <tr className="bg-gray-800">
          <th className="p-3 text-left">Nombre</th>
          <th className="p-3 text-left">Usuario</th>
          <th className="p-3 text-left">Roles</th>
          <th className="p-3 text-left">Estado</th>
          <th className="p-3 text-left">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan="5" className="p-4 text-center text-gray-400">
              No hay usuarios registrados
            </td>
          </tr>
        )}

        {users.map((u) => (
          <tr
            key={u.id}
            className="border-t border-gray-700 hover:bg-gray-800 transition"
          >
            <td className="p-3">{u.name}</td>
            <td className="p-3">{u.username}</td>
            <td className="p-3 text-sm">
              {u.roles.map((r) => (
                <span
                  key={r}
                  className="px-2 py-1 mr-2 bg-blue-900 rounded-md text-blue-300 text-xs"
                >
                  {r}
                </span>
              ))}
            </td>

            <td className="p-3">
              <span
                className={`px-2 py-1 rounded-md text-xs ${
                  u.active ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                }`}
              >
                {u.active ? "Activo" : "Inactivo"}
              </span>
            </td>

            <td className="p-3 flex gap-2">
              <Link
                to={`/users/edit/${u.id}`}
                className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Editar
              </Link>

              <button
                onClick={() => onToggleActive(u.id)}
                className={`px-3 py-1 rounded ${
                  u.active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {u.active ? "Desactivar" : "Activar"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
