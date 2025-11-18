// src/pages/users/UserCreatePage.jsx

import { createUser } from "../../api/usersApi";
import UserForm from "./UserForm";
import AppLayout from "../../components/layout/LppLayout";

export default function UserCreatePage() {
  const handleSubmit = async (data) => {
    await createUser(data);
    alert("Usuario creado");
    window.location.href = "/users";
  };

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Crear Usuario</h1>
        <UserForm onSubmit={handleSubmit} />
      </div>
    </AppLayout>
  );
}
