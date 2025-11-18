export default function RecentSales({ sales }) {
  return (
    <div className="glass p-4 rounded-xl border border-white/10">
      <h4 className="text-white/80 mb-3">Ventas recientes</h4>
      <div className="space-y-3 max-h-[260px] overflow-auto">
        {sales.map((s) => (
          <div key={s.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
            <div>
              <div className="text-white">{s.sale_code}</div>
              <div className="text-xs text-white/60">
                {new Date(s.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-emerald-400 font-semibold">${s.total_usd.toFixed(2)}</div>
              {s.customer && <div className="text-xs text-white/60">{s.customer.name}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
