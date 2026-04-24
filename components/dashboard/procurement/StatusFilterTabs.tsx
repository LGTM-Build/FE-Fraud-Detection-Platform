import { FilterStatus, FILTER_LABELS, ProcurementTransaction } from "@/data/procurement";

const FILTER_ORDER: FilterStatus[] = ["all", "high-alert", "pending", "auto-approved", "approved", "rejected"];

interface StatusFilterTabsProps {
  filterStatus: FilterStatus;
  filterBU: string;
  businessUnits: string[];
  data: ProcurementTransaction[];
  onStatusChange: (s: FilterStatus) => void;
  onBUChange: (bu: string) => void;
  isMobile?: boolean;
}

export function StatusFilterTabs({ filterStatus, filterBU, businessUnits, data, onStatusChange, onBUChange, isMobile }: StatusFilterTabsProps) {
  const counts: Record<FilterStatus, number> = {
    all: data.length,
    "high-alert": data.filter(t => t.status === "high-alert").length,
    pending: data.filter(t => t.status === "pending").length,
    "auto-approved": data.filter(t => t.status === "auto-approved").length,
    approved: data.filter(t => t.status === "approved").length,
    rejected: data.filter(t => t.status === "rejected").length,
  };

  return (
    <div style={{
      display: "flex", flexDirection: isMobile ? "column" : "row",
      gap: "6px", flexWrap: isMobile ? "nowrap" : "wrap",
      background: "var(--card-bg)", border: "1px solid var(--card-b)",
      borderRadius: "14px", padding: "6px",
    }}>
      <div style={{
        display: "flex", gap: "4px", flex: 1,
        overflowX: isMobile ? "auto" : "visible",
        flexWrap: isMobile ? "nowrap" : "wrap",
        scrollbarWidth: "none", msOverflowStyle: "none",
      }}>
        {FILTER_ORDER.map(s => {
          const isActive = filterStatus === s;
          const isAlert = s === "high-alert";
          return (
            <button key={s} onClick={() => onStatusChange(s)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: isMobile ? "6px 10px" : "7px 14px",
              borderRadius: "10px", border: "none",
              fontSize: isMobile ? "11px" : "12px",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontWeight: isActive ? 500 : 400, transition: "all 0.15s",
              whiteSpace: "nowrap", flexShrink: 0,
              background: isActive ? (isAlert ? "rgba(239,68,68,0.12)" : "var(--em-subtle-2)") : "transparent",
              color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)",
            }}>
              {FILTER_LABELS[s]}
              <span style={{
                fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "100px",
                background: isActive ? (isAlert ? "rgba(239,68,68,0.15)" : "var(--em-subtle-2)") : "var(--surface-2)",
                color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)",
              }}>{counts[s]}</span>
            </button>
          );
        })}
      </div>
      <div style={{ flexShrink: 0, alignSelf: isMobile ? "stretch" : "center" }}>
        <select value={filterBU} onChange={e => onBUChange(e.target.value)} style={{
          padding: "7px 12px", borderRadius: "10px",
          border: "1px solid var(--border)", background: "var(--surface-2)",
          color: "var(--ts)", fontSize: "12px", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", outline: "none",
          width: isMobile ? "100%" : "auto",
        }}>
          <option value="all">Semua Unit Bisnis</option>
          {businessUnits.filter(d => d !== "all").map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}