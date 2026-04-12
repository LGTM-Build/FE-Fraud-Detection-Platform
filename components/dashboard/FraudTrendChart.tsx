"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { dataMonthly, dataWeekly, chartLegend, type Range } from "@/data/fraud-trend-chart";
import ChartTooltip from "@/components/ui/ChartTooltip";

export default function FraudTrendChart() {
  const [range, setRange] = useState<Range>("monthly");
  const data = range === "monthly" ? dataMonthly : dataWeekly;

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-b)",
      borderRadius: "16px",
      padding: "24px 24px 16px",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: "24px", gap: "12px",
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

        {/* Range toggle */}
        <div style={{
          display: "flex",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "3px",
          gap: "2px",
          flexShrink: 0,
        }}>
          {(["weekly", "monthly"] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "5px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                fontWeight: range === r ? 500 : 400,
                cursor: "pointer",
                transition: "all 0.18s",
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
      <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
        {chartLegend.map(l => (
          <div key={l.key} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ width: "24px", height: "3px", borderRadius: "2px", background: l.color, display: "block" }} />
            <span style={{ fontSize: "12px", color: "var(--ts)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
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
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: "var(--tm)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} dy={8} />
          <YAxis tick={{ fontSize: 11, fill: "var(--tm)", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="expense" stroke="#10b981" strokeWidth={2} fill="url(#gradExpense)" dot={false} activeDot={{ r: 5, fill: "#10b981", stroke: "var(--bg)", strokeWidth: 2 }} />
          <Area type="monotone" dataKey="procurement" stroke="#6ee7b7" strokeWidth={2} fill="url(#gradProcurement)" dot={false} activeDot={{ r: 5, fill: "#6ee7b7", stroke: "var(--bg)", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}