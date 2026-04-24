"use client"

import { HIGH_ALERT_ITEMS, HIGH_ALERT_TOTAL, HighAlertItem } from "@/data/high-alert";

function HighAlertRow({ item, isLast }: { item: HighAlertItem; isLast: boolean }) {
  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "10px",
        cursor: "pointer", transition: "background 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
    >
      {/* Score circle */}
      <div style={{
        width: "34px", height: "34px", borderRadius: "10px",
        background: "rgba(239,68,68,0.10)",
        border: "1px solid rgba(239,68,68,0.20)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626" }}>
          {item.score}
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "12px", fontWeight: 500, color: "var(--tp)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          marginBottom: "2px",
        }}>
          {item.desc}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", color: "var(--em)", fontWeight: 600 }}>{item.id}</span>
          <span style={{ fontSize: "10px", color: "var(--tm)" }}>·</span>
          <span style={{ fontSize: "10px", color: "var(--tm)" }}>{item.amount}</span>
        </div>
      </div>

      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4.5 2.5l3 3-3 3" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function HighAlertList() {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-b)",
      borderRadius: "16px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      // On mobile/tablet, limit height so it doesn't get too tall in column layout
      maxHeight: "420px",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "14px", fontWeight: 700,
            color: "var(--tp)", letterSpacing: "-0.2px",
            marginBottom: "2px",
          }}>
            High Alert
          </h3>
          <p style={{ fontSize: "11px", color: "var(--tm)" }}>Perlu tindakan segera</p>
        </div>
        <span style={{
          padding: "3px 10px", borderRadius: "100px",
          background: "rgba(239,68,68,0.10)",
          border: "1px solid rgba(239,68,68,0.20)",
          fontSize: "11px", color: "#dc2626", fontWeight: 600,
        }}>
          {HIGH_ALERT_TOTAL} kasus
        </span>
      </div>

      {/* List — scrollable if needed */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {HIGH_ALERT_ITEMS.map((item, i) => (
          <HighAlertRow
            key={item.id}
            item={item}
            isLast={i === HIGH_ALERT_ITEMS.length - 1}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <a href="/dashboard/expense" style={{
          fontSize: "12px", color: "var(--em)",
          textDecoration: "none", fontWeight: 500,
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          Lihat semua high alert
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}