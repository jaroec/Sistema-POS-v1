// src/pages/InventoryPage.jsx
import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import StockEntryForm from "../components/inventory/StockEntryForm";
import MovementsTable from "../components/inventory/MovementsTable";
import { listMovements } from "../api/inventoryApi";

export default function InventoryPage() {
  const [movements, setMovements] = useState([]);
  const [filterProduct, setFilterProduct] = useState("");

  const load = async () => {
    const rows = await listMovements(filterProduct || null);
    setMovements(rows);
  };

  useEffect(() => { load(); }, [filterProduct]);

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Inventario — Entradas y Ajustes</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <StockEntryForm onDone={load} />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-4">
              <input
                placeholder="Filtrar por id o código de producto..."
                className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
              />
            </div>

            <MovementsTable movements={movements} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
