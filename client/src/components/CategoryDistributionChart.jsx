import { Doughnut } from "react-chartjs-2";

export default function CategoryDistributionChart({ items = [] }) {
  const safe = Array.isArray(items) ? items : [];

  const labels = safe.map((r) => r.category ?? "");
  const totals = safe.map((r) => Number(r.total ?? 0));

  const data = {
    labels,
    datasets: [
      {
        label: "By Category",
        data: totals,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: 320, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
      <h3 style={{ margin: "0 0 8px" }}>Spending by Category</h3>
      <div style={{ height: 260 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
