export default function DateRangePicker({ range, setRange }) {
  return (
    <div className="flex gap-2 items-center">
      <input type="date" value={range.start || ""} onChange={(e)=> setRange({...range, start: e.target.value})} className="p-2 bg-white/10 text-white rounded" />
      <span className="text-white/60">a</span>
      <input type="date" value={range.end || ""} onChange={(e)=> setRange({...range, end: e.target.value})} className="p-2 bg-white/10 text-white rounded" />
    </div>
  );
}
