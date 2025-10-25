export default function SavingsProgressChart({ data = { goal: 0, progress: 0, percent: 0 } }) {
  const goal = Number(data.goal ?? 0);
  const progress = Number(data.progress ?? 0);
  const percent = Math.max(0, Math.min(100, Number(data.percent ?? (goal ? (progress / goal) * 100 : 0))));

  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>Savings Progress</h3>
      <div style={{ margin: "8px 0 12px", background: "#f2f2f2", borderRadius: 6, height: 20, overflow: "hidden" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#4caf50",
            transition: "width 300ms ease",
          }}
        />
      </div>
      <div>
        ${progress.toLocaleString()} / ${goal.toLocaleString()} ({percent.toFixed(1)}%)
      </div>
    </div>
  );
}
