import { useEffect, useState } from "react";
import api from "../api";
import MonthlySpendingChart from "../components/MonthlySpendingChart";
import CategoryDistributionChart from "../components/CategoryDistributionChart";
import SavingsProgressChart from "../components/SavingsProgressChart";

export default function Dashboard() {
  // Always initialize to arrays so charts can render even before data arrives
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savings, setSavings] = useState({ goal: 0, progress: 0, percent: 0 });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const [mRes, cRes, sRes] = await Promise.all([
          api.get("/api/analytics/monthly"),
          api.get("/api/analytics/categories"),
          api.get("/api/analytics/savings"),
        ]);

        if (cancelled) return;

        // API returns { items: [...] } for monthly & categories, and an object for savings
        setMonthly(Array.isArray(mRes.data?.items) ? mRes.data.items : []);
        setCategories(Array.isArray(cRes.data?.items) ? cRes.data.items : []);
        setSavings(
          sRes.data && typeof sRes.data === "object"
            ? sRes.data
            : { goal: 0, progress: 0, percent: 0 }
        );
      } catch (e) {
        // If 401 happens on refresh, you’ll still render the page (with empty charts) instead of crashing
        console.error("Dashboard load error:", e);
        setErr(e?.response?.data?.msg || e.message || "Failed to load dashboard");
        setMonthly([]);
        setCategories([]);
        setSavings({ goal: 0, progress: 0, percent: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      {loading && <div style={{ marginBottom: 12 }}>Loading…</div>}
      {err && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          {String(err)}
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        <MonthlySpendingChart items={monthly} />
        <CategoryDistributionChart items={categories} />
        <SavingsProgressChart data={savings} />
      </div>
    </div>
  );
}
