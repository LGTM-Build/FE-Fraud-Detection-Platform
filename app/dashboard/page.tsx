"use client"

import SummaryCards from "@/components/dashboard/SummaryCards";
import FraudTrendChart from "@/components/dashboard/FraudTrendChart";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import QuickActions from "@/components/dashboard/QuickActions";
import HighAlertList from "@/components/dashboard/HighAlertList";

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Page header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: "16px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "22px", fontWeight: 800,
            color: "var(--tp)", letterSpacing: "-0.8px",
            marginBottom: "4px",
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
            Ringkasan aktivitas fraud hari ini
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Chart + high alert panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
        <FraudTrendChart />
        <HighAlertList />
      </div>

      {/* Transactions table */}
      <RecentTransactionsTable />

    </div>
  );
}