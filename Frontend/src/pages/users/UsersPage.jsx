// src/pages/users/UsersPage.jsx

import { useEffect, useState } from "react";
import { getUsers, toggleActiveUser } from "../../api/usersApi";
import UsersTable from "../../components/users/UsersTable";
import { Link } from "react-router-dom";
import AppLayout from "../../components/layout/LppLayout";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getUsers();
      setData(res.users);
    }
    load();
  }, [reload]);

  const handleToggleActive = async (id) => {
    await toggleActiveUser(id);
    setReload(!reload);
  };

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Usuarios</h1>

          <Link
            to="/users/create"
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Crear Usuario
          </Link>
        </div>

        <UsersTable users={data} onToggleActive={handleToggleActive} />
      </div>
    </AppLayout>
  );
}
