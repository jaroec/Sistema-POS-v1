import { useState } from "react";
import { createCustomer, updateCustomer } from "../../api/customersApi";

export default function CustomerForm({ customer, close }) {
  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    address: customer?.address || "",
  });

  const save = async () => {
    if (customer) await updateCustomer(customer.id, form);
    else await createCustomer(form);

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl border border-white/10 w-[400px]">
        <h2 className="text-xl text-white font-semibold mb-4">
          {customer ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>

        <div className="space-y-3">
          {["name", "phone", "email", "address"].map((field) => (
            <input
              key={field}
              placeholder={field.toUpperCase()}
              className="w-full p-2 bg-white/10 text-white border border-white/10 rounded"
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
            />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={save}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 p-2 rounded text-white"
          >
            Guardar
          </button>

          <button
            onClick={close}
            className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
