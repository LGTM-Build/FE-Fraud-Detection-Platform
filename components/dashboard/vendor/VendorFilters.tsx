import { FilterStatus, FILTER_LABELS, Vendor } from "@/data/vendors";

const FILTER_ORDER: FilterStatus[] = ["all", "active", "watchlist", "blacklisted"];

const ALERT_COLOR: Record<FilterStatus, string> = {
  all: "var(--em)",
  active: "var(--em)",
  watchlist: "#d97706",
  blacklisted: "#dc2626",
};

interface VendorFiltersProps {
  filterStatus: FilterStatus;
  search: string;
  vendors: Vendor[];
  onStatusChange: (s: FilterStatus) => void;
  onSearchChange: (q: string) => void;
}

export function VendorFilters({
  filterStatus,
  search,
  vendors,
  onStatusChange,
  onSearchChange,
}: VendorFiltersProps) {
  const counts: Record<FilterStatus, number> = {
    all: vendors.length,
    active: vendors.filter((v) => v.status === "active").length,
    watchlist: vendors.filter((v) => v.status === "watchlist").length,
    blacklisted: vendors.filter((v) => v.status === "blacklisted").length,
  };

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "6px" }}>
      {FILTER_ORDER.map((s) => {
        const isActive = filterStatus === s;
        return (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", borderRadius: "10px", border: "none",
              fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontWeight: isActive ? 500 : 400, transition: "all 0.15s",
              background: isActive ? "var(--em-subtle-2)" : "transparent",
              color: isActive ? ALERT_COLOR[s] : "var(--tm)",
            }}
          >
            {FILTER_LABELS[s]}
            <span style={{
              fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "100px",
              background: isActive ? "var(--em-subtle)" : "var(--surface-2)",
              color: isActive ? ALERT_COLOR[s] : "var(--tm)",
            }}>
              {counts[s]}
            </span>
          </button>
        );
      })}

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 12px", height: "34px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--surface-2)", width: "220px", marginLeft: "auto" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          placeholder="Cari vendor atau NPWP..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ border: "none", background: "transparent", fontSize: "13px", color: "var(--tp)", outline: "none", width: "160px", fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>
    </div>
  );
}