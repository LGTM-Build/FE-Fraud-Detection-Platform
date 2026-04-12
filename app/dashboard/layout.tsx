"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        // Expose sidebar width as CSS var so TopBar fixed can sync its left offset
        ["--sidebar-w" as string]: collapsed ? "64px" : "220px",
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <TopBar title="Dashboard" subtitle="Ringkasan aktivitas fraud hari ini" />

        <main style={{
          flex: 1,
          padding: "28px",
          overflowY: "auto",
          overflowX: "hidden",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}