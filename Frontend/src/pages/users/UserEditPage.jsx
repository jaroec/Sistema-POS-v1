// src/pages/users/UserEditPage.jsx

import { useEffect, useState } from "react";
import { getUsers, updateUser } from "../../api/usersApi";
import UserForm from "./UserForm";
import { useParams } from "react-router-dom";
import AppLayout from "../../components/layout/LppLayout";

export default function UserEditPage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getUsers();
      const found = res.users.find((u) => u.id == id);
      setUser(found);
    }
    load();
  }, [id]);

  const handleSubmit = async (data) => {
    await updateUser(id, data);
    alert("Usuario actualizado");
    window.location.href = "/users";
  };

  if (!user) return <AppLayout>Cargando...</AppLayout>;

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
        <UserForm onSubmit={handleSubmit} initialData={user} />
      </div>
    </AppLayout>
  );
}
