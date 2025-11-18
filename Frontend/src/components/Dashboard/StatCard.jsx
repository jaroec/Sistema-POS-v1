export default function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="glass p-4 rounded-xl border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white/80 text-sm">{title}</h4>
          <div className="text-2xl font-bold text-white mt-1">{value}</div>
          {subtitle && (
            <div className="text-xs text-white/60 mt-1">{subtitle}</div>
          )}
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </div>
  );
}
