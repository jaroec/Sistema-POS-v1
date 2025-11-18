import OpenCash from "./OpenCash";
import CloseCash from "./CloseCash";

export default function CashStatus({ cash, reload }) {
  if (!cash?.exists)
    return <OpenCash reload={reload} />;

  if (cash.status === "closed")
    return (
      <div className="p-4 bg-white/10 border border-white/10 rounded-xl">
        <p className="text-white/60">
          La caja de hoy ya se encuentra <span className="text-red-400">cerrada</span>.
        </p>
      </div>
    );

  return <CloseCash cash={cash} reload={reload} />;
}
