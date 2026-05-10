"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ChartTooltip from "@/components/ui/ChartTooltip";

// Format data dari backend: { period: "monthly", year: 2024, items: [...] }
// Item shape: { label: "Jan", month: 1, expense: 3, procurement: 2, total: 5 }
interface FraudTrendData {
  period: string;
  year: number;
  items: {
    label: string;
    month: number;
    expense: number;
    procurement: number;
    total: number;
  }[];
}

interface ChartProps {
  trendData: FraudTrendData | null;
}

const chartLegend = [
  { key: "expense", label: "Expense Fraud", color: "#10b981" },
  { key: "procurement", label: "Procurement Fraud", color: "#6ee7b7" },
];

export default function FraudTrendChart({ trendData }: ChartProps) {
  // Ambil items dari response backend, fallback ke array kosong
  const rawItems = trendData?.items ?? [];

  // Map ke format yang dipakai chart: ganti "label" jadi "period" untuk XAxis dataKey
  const data = rawItems.map((item) => ({
    period: item.label,
    expense: item.expense,
    procurement: item.procurement,
    total: item.total,
  }));

  // Filter hanya bulan yang sudah lewat atau punya data (biar grafik tidak flat di kanan)
  const currentMonth = new Date().getMonth() + 1; // 1–12
  const currentYear = new Date().getFullYear();
  const targetYear = trendData?.year ?? currentYear;
  const isCurrentYear = targetYear === currentYear;

  const chartData = isCurrentYear
    ? data.filter((_, i) => (rawItems[i]?.month ?? 0) <= currentMonth)
    : data;

  const isDataEmpty = chartData.length === 0;
  const isNotEnoughData = chartData.length === 1;

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-b)",
      borderRadius: "16px",
      padding: "20px 16px 12px",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: "20px", gap: "12px",
        flexWrap: "wrap",
      }}>
        <div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "15px", fontWeight: 700,
            color: "var(--tp)", letterSpacing: "-0.3px", marginBottom: "4px",
          }}>
            Tren Deteksi Fraud
          </h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>
            Jumlah kasus yang di-flag AI per bulan · {targetYear}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
        {chartLegend.map(l => (
          <div key={l.key} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ width: "20px", height: "3px", borderRadius: "2px", background: l.color, display: "block", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "var(--ts)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart / Empty State */}
      <div style={{ width: "100%", height: "200px" }}>
        {isDataEmpty ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "10px" }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>
              Belum ada data tren
            </div>
            <div style={{ fontSize: "12px", color: "var(--tm)", maxWidth: "250px", marginTop: "4px" }}>
              Grafik akan muncul otomatis setelah ada aktivitas transaksi.
            </div>
          </div>
        ) : isNotEnoughData ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "10px" }}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>Belum cukup data</div>
            <div style={{ fontSize: "12px", color: "var(--tm)", maxWidth: "250px", marginTop: "4px" }}>
              Sistem membutuhkan setidaknya 2 bulan transaksi untuk membuat garis tren.
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.20}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradProcurement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6ee7b7" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: "var(--tm)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} dy={8} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: "var(--tm)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="expense" stroke="#10b981" strokeWidth={2} fill="url(#gradExpense)" dot={false} activeDot={{ r: 5, fill: "#10b981", stroke: "var(--bg)", strokeWidth: 2 }} />
              <Area type="monotone" dataKey="procurement" stroke="#6ee7b7" strokeWidth={2} fill="url(#gradProcurement)" dot={false} activeDot={{ r: 5, fill: "#6ee7b7", stroke: "var(--bg)", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}