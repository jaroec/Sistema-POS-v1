export default function ReportCards({ report, loading }) {
  if (loading || !report) return <div className="text-white">Cargando...</div>;

  const totalSales = report.sales.reduce((s, r) => s + r.total_usd, 0);
  return (
    <div className="col-span-1 lg:col-span-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 p-4 rounded">
          <h4 className="text-sm text-white/80">Ventas periodo</h4>
          <div className="text-2xl font-bold text-emerald-400">${totalSales.toFixed(2)}</div>
        </div>

        <div className="bg-white/10 p-4 rounded">
          <h4 className="text-sm text-white/80">Top producto</h4>
          <div>{report.topProducts[0]?.name || "—"}</div>
        </div>

        <div className="bg-white/10 p-4 rounded">
          <h4 className="text-sm text-white/80">Clientes con deuda</h4>
          <div>{report.customers.customersWithDebt?.length ?? 0}</div>
        </div>
      </div>
    </div>
  );
}
