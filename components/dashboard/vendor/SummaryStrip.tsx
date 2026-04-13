import { Vendor } from "@/data/vendors";

interface SummaryStripProps {
  vendors: Vendor[];
}

export function SummaryStrip({ vendors }: SummaryStripProps) {
  const counts = {
    blacklisted: vendors.filter((v) => v.status === "blacklisted").length,
    watchlist: vendors.filter((v) => v.status === "watchlist").length,
    active: vendors.filter((v) => v.status === "active").length,
  };

  const items = [
    { label: "Blacklisted", count: counts.blacklisted, color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.18)" },
    { label: "Watchlist",   count: counts.watchlist,   color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)" },
    { label: "Active",      count: counts.active,      color: "var(--em)", bg: "var(--em-subtle)", border: "rgba(16,185,129,0.18)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
      {items.map((s) => (
        <div
          key={s.label}
          style={{ padding: "16px 20px", borderRadius: "14px", background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span style={{ fontSize: "13px", color: s.color, fontWeight: 500 }}>{s.label}</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</span>
        </div>
      ))}
    </div>
  );
}