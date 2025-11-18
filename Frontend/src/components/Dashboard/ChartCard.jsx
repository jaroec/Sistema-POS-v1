import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, LinearScale, PointElement, CategoryScale } from "chart.js";

ChartJS.register(LineElement, LinearScale, PointElement, CategoryScale);

export default function ChartCard({ title, labels, data, color }) {
  return (
    <div className="glass p-4 rounded-xl border border-white/10">
      <h4 className="text-white/80 mb-3">{title}</h4>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: title,
              data,
              borderColor: color || "#4ade80",
              tension: 0.4,
              pointRadius: 2,
            },
          ],
        }}
        options={{
          scales: { y: { ticks: { color: "white" } }, x: { ticks: { color: "white" } } },
          plugins: { legend: { labels: { color: "white" } } },
        }}
      />
    </div>
  );
}
