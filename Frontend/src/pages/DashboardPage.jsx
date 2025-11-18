import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";

import {
  getDayStats,
  getMonthStats,
  getLowStock,
  getTopProducts,
  getWeeklySales,
  getPaymentMethodStats,
  getRecentSales,
} from "../api/dashboardApi";

import StatCard from "../components/Dashboard/StatCard";
import ChartCard from "../components/Dashboard/ChartCard";
import RecentSales from "../components/Dashboard/RecentSales";

export default function DashboardPage() {
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [top, setTop] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [methods, setMethods] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [
          d,
          m,
          low,
          topP,
          week,
          payMethods,
          recentSales,
        ] = await Promise.all([
          getDayStats(),
          getMonthStats(),
          getLowStock(),
          getTopProducts(),
          getWeeklySales(),
          getPaymentMethodStats(),
          getRecentSales(),
        ]);

        setDay(d);
        setMonth(m);
        setLowStock(low);
        setTop(topP);
        setWeekly(week);
        setMethods(payMethods);
        setRecent(recentSales);

      } catch (err) {
        console.error(err);
        alert("Error cargando dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <AppLayout>Cargando…</AppLayout>;

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Sección de estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Ventas del día"
          value={`$${day.total_usd.toFixed(2)}`}
          subtitle={`${day.total_ves.toLocaleString()} VES`}
          icon="💵"
        />
        <StatCard
          title="Ventas del mes"
          value={`$${month.total_usd.toFixed(2)}`}
          icon="📅"
        />
        <StatCard
          title="Productos con poco stock"
          value={lowStock.length}
          icon="⚠️"
        />
        <StatCard
          title="Clientes con deuda"
          value={month.customers_with_balance}
          icon="🧾"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Ventas últimos 7 días"
          labels={weekly.map((w) => w.label)}
          data={weekly.map((w) => w.total)}
          color="#4ade80"
        />

        <ChartCard
          title="Métodos de pago más usados"
          labels={methods.map((m) => m.method)}
          data={methods.map((m) => m.total)}
          color="#60a5fa"
        />
      </div>

      {/* Listas: top productos + ventas recientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-4 rounded-xl border border-white/10">
          <h4 className="text-white/80 mb-3">Top productos</h4>
          <div className="space-y-2">
            {top.map((p) => (
              <div key={p.product_id} className="flex justify-between p-2 bg-white/5 rounded">
                <div>{p.name}</div>
                <div className="text-emerald-400">{p.quantity}</div>
              </div>
            ))}
          </div>
        </div>

        <RecentSales sales={recent} />
      </div>
    </AppLayout>
  );
}
