"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import ChartTooltip from "@/components/ui/ChartTooltip";

type Range = "weekly" | "monthly";

interface ChartProps {
  trendWeekly: any[];
  trendMonthly: any[];
}

const chartLegend = [
  { key: "expense", label: "Expense Fraud", color: "#10b981" },
  { key: "procurement", label: "Procurement Fraud", color: "#6ee7b7" },
];

export default function FraudTrendChart({ trendWeekly, trendMonthly }: ChartProps) {
  const [range, setRange] = useState<Range>("weekly");
  
  // Pastikan kalau API ngirim undefined/null, kita fallback ke array kosong []
  const safeTrendWeekly = trendWeekly || [];
  const safeTrendMonthly = trendMonthly || [];
  
  const data = range === "monthly" ? safeTrendMonthly : safeTrendWeekly;

  // LOGIKA EMPTY STATE:
  // 1. Kalau array-nya beneran kosong (belum ada transaksi sama sekali)
  const isDataEmpty = data.length === 0;
  // 2. Kalau pilih bulanan tapi datanya baru 1 bulan (kurang buat narik garis tren)
  const isNotEnoughDataForMonthly = range === "monthly" && data.length === 1;

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-b)",
      borderRadius: "16px",
      padding: "20px 16px 12px",
    }}>
      {/* Header & Toggle */}
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
            Jumlah kasus yang di-flag AI per periode
          </p>
        </div>

        <div style={{
          display: "flex", background: "var(--surface-2)",
          border: "1px solid var(--border)", borderRadius: "10px",
          padding: "3px", gap: "2px", flexShrink: 0,
        }}>
          {(["weekly", "monthly"] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "5px 14px", borderRadius: "8px", border: "none", fontSize: "12px",
                fontWeight: range === r ? 500 : 400, cursor: "pointer", transition: "all 0.18s",
                fontFamily: "'DM Sans', sans-serif",
                background: range === r ? "var(--em-subtle-2)" : "transparent",
                color: range === r ? "var(--em)" : "var(--tm)",
              }}
            >
              {r === "weekly" ? "Mingguan" : "Bulanan"}
            </button>
          ))}
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

      {/* Area Render Chart / Empty State */}
      <div style={{ width: "100%", height: "200px" }}>
        {isDataEmpty ? (
          /* TAMPILAN KETIKA DATA KOSONG */
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "10px" }}>
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>
              Belum ada data {range === "weekly" ? "mingguan" : "bulanan"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--tm)", maxWidth: "250px", marginTop: "4px" }}>
              Grafik akan muncul otomatis setelah ada aktivitas transaksi.
            </div>
          </div>
        ) : isNotEnoughDataForMonthly ? (
          /* TAMPILAN KETIKA DATA BULANAN KURANG (BARU 1 BULAN) */
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.8 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: "10px" }}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>Belum cukup data bulanan</div>
            <div style={{ fontSize: "12px", color: "var(--tm)", maxWidth: "250px", marginTop: "4px" }}>
              Sistem membutuhkan setidaknya 2 bulan transaksi untuk membuat garis tren.
            </div>
          </div>
        ) : (
          /* TAMPILAN NORMAL CHART */
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
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
              <YAxis tick={{ fontSize: 10, fill: "var(--tm)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
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