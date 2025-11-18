import { useEffect, useState } from "react";
import AppLayout from "../components/layout/LppLayout";
import DateRangePicker from "../components/reports/DateRangePicker";
import ReportCards from "../components/reports/ReportCards";
import { fetchDashboardReport, exportSalesCSV } from "../api/reportsApi";

export default function ReportsPage() {
  const [range, setRange] = useState({ start: null, end: null });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (start, end) => {
    setLoading(true);
    const data = await fetchDashboardReport(start, end);
    setReport(data);
    setLoading(false);
  };

  useEffect(() => {
    // carga últimos 7 días por defecto
    const end = new Date().toISOString().split("T")[0];
    const start = new Date(Date.now() - 6 * 24*3600*1000).toISOString().split("T")[0];
    setRange({ start, end });
    load(start, end);
  }, []);

  const handleExport = async () => {
    const blob = await exportSalesCSV(range.start, range.end);
    const url = window.URL.createObjectURL(blob.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_${range.start}_${range.end}.csv`;
    a.click();
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>

      <div className="mb-4">
        <DateRangePicker range={range} setRange={(r) => { setRange(r); load(r.start, r.end); }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ReportCards report={report} loading={loading} />
      </div>

      <div className="mt-6">
        <button onClick={handleExport} className="bg-white/10 px-4 py-2 rounded text-white">Exportar ventas CSV</button>
      </div>

      {/* Aquí podrías poner tablas o gráficos detallados */}
    </AppLayout>
  );
}
