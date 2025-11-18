// src/pages/KardexPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { getKardex } from "../api/inventoryApi";
import KardexTable from "../components/inventory/KardexTable";

export default function KardexPage() {
  const { productId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!productId) return;
    getKardex(productId).then(setData).catch(err => {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Error cargando kardex");
    });
  }, [productId]);

  if (!data) return <AppLayout><div className="p-6 text-white">Cargando kardex…</div></AppLayout>;

  return (
    <AppLayout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Kardex — {data.product.product_code} {data.product.name}</h1>
        <KardexTable entries={data.entries} />
      </div>
    </AppLayout>
  );
}
