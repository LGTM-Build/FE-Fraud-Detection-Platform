"use client"

import { useEffect, useState } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import FraudTrendChart from "@/components/dashboard/FraudTrendChart";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable";
import QuickActions from "@/components/dashboard/QuickActions";
import HighAlertList from "@/components/dashboard/HighAlertList";
import { usePageTitle } from "@/contexts/TopBarContext";

export default function DashboardPage() {

  usePageTitle({
    title: "Dashboard",
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "24px" }}>

      {/* Page header */}
      <div style={{
        display: "flex",
        alignItems: isMobile ? "flex-start" : "flex-start",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        gap: "12px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? "18px" : "22px",
            fontWeight: 800,
            color: "var(--tp)",
            letterSpacing: "-0.8px",
            marginBottom: "4px",
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
            Ringkasan aktivitas fraud hari ini
          </p>
        </div>
        <QuickActions isMobile={isMobile} />
      </div>

      {/* Summary cards */}
      <SummaryCards isMobile={isMobile} isTablet={isTablet} />

      {/* Chart + high alert panel */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "1fr 320px",
        gap: isMobile ? "16px" : "20px",
      }}>
        <FraudTrendChart />
        <HighAlertList />
      </div>

      {/* Transactions table */}
      <RecentTransactionsTable isMobile={isMobile} />

    </div>
  );
}