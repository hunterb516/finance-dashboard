import { Line } from "react-chartjs-2";

export default function MonthlySpendingChart({ items = [] }) {
  const safe = Array.isArray(items) ? items : [];

  const labels = safe.map((r) => r.month ?? "");
  const income = safe.map((r) => Number(r.income ?? 0));
  const expenses = safe.map((r) => Number(r.expenses ?? 0));

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: income,
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Expenses",
        data: expenses,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: 320, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
      <h3 style={{ margin: "0 0 8px" }}>Monthly Income vs Expenses</h3>
      <div style={{ height: 260 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
