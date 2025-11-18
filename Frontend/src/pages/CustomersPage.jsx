import { useEffect, useState } from "react";
import {
  fetchCustomers,
  deleteCustomer,
} from "../api/customersApi";

import AppLayout from "../components/layout/AppLayout";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerHistory from "../components/customers/CustomerHistory";
import CustomerDebtModal from "../components/customers/CustomerDebtModal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDebt, setShowDebt] = useState(false);

  const loadCustomers = async () => {
    const data = await fetchCustomers(search);
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const edit = (customer) => {
    setSelected(customer);
    setShowForm(true);
  };

  const create = () => {
    setSelected(null);
    setShowForm(true);
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;
    await deleteCustomer(id);
    loadCustomers();
  };

  return (
    <AppLayout>
      <div className="text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clientes</h1>

          <button
            onClick={create}
            className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
          >
            Nuevo Cliente
          </button>
        </div>

        {/* BUSCADOR */}
        <input
          className="w-full p-3 bg-white/10 border border-white/10 rounded text-white mb-4"
          placeholder="Buscar cliente por nombre o documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLA */}
        <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Email</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.email}</td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => edit(c)}
                      className="text-emerald-400 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        setSelected(c);
                        setShowHistory(true);
                      }}
                      className="text-blue-400 hover:underline"
                    >
                      Historial
                    </button>

                    <button
                      onClick={() => {
                        setSelected(c);
                        setShowDebt(true);
                      }}
                      className="text-yellow-300 hover:underline"
                    >
                      Deudas
                    </button>

                    <button
                      onClick={() => remove(c.id)}
                      className="text-red-400 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td className="p-3 text-white/50">No hay clientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <CustomerForm
          customer={selected}
          close={() => {
            setShowForm(false);
            loadCustomers();
          }}
        />
      )}

      {/* HISTORIAL */}
      {showHistory && (
        <CustomerHistory
          customer={selected}
          close={() => setShowHistory(false)}
        />
      )}

      {/* DEUDAS */}
      {showDebt && (
        <CustomerDebtModal
          customer={selected}
          close={() => setShowDebt(false)}
        />
      )}
    </AppLayout>
  );
}
