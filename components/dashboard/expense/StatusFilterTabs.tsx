import { FilterStatus, FILTER_LABELS, ExpenseTransaction } from "@/data/expenses";

interface StatusFilterTabsProps {
  filterStatus: FilterStatus;
  filterDept: string;
  departments: string[];
  expenses: ExpenseTransaction[];
  onStatusChange: (s: FilterStatus) => void;
  onDeptChange: (d: string) => void;
  isMobile?: boolean;
}

const STATUS_ORDER: FilterStatus[] = [
  "all", "high-alert", "pending", "auto-approved", "approved", "rejected",
];

export function StatusFilterTabs({
  filterStatus, filterDept, departments, expenses,
  onStatusChange, onDeptChange, isMobile,
}: StatusFilterTabsProps) {
  const counts: Record<FilterStatus, number> = {
    all: expenses.length,
    "high-alert": expenses.filter(t => t.status === "high-alert").length,
    pending: expenses.filter(t => t.status === "pending").length,
    "auto-approved": expenses.filter(t => t.status === "auto-approved").length,
    approved: expenses.filter(t => t.status === "approved").length,
    rejected: expenses.filter(t => t.status === "rejected").length,
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "6px",
      flexWrap: isMobile ? "nowrap" : "wrap",
      background: "var(--card-bg)",
      border: "1px solid var(--card-b)",
      borderRadius: "14px",
      padding: "6px",
    }}>
      {/* Status tabs — scrollable on mobile */}
      <div style={{
        display: "flex",
        gap: "4px",
        overflowX: isMobile ? "auto" : "visible",
        flexWrap: isMobile ? "nowrap" : "wrap",
        flex: 1,
        // hide scrollbar but still scrollable
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {STATUS_ORDER.map(s => {
          const isActive = filterStatus === s;
          const isAlert = s === "high-alert";
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: isMobile ? "6px 10px" : "7px 14px",
                borderRadius: "10px",
                border: "none",
                fontSize: isMobile ? "11px" : "12px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 500 : 400,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: isActive
                  ? isAlert ? "rgba(239,68,68,0.12)" : "var(--em-subtle-2)"
                  : "transparent",
                color: isActive
                  ? isAlert ? "#dc2626" : "var(--em)"
                  : "var(--tm)",
              }}
            >
              {FILTER_LABELS[s]}
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: "100px",
                background: isActive
                  ? isAlert ? "rgba(239,68,68,0.15)" : "var(--em-subtle-2)"
                  : "var(--surface-2)",
                color: isActive
                  ? isAlert ? "#dc2626" : "var(--em)"
                  : "var(--tm)",
              }}>
                {counts[s]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dept filter */}
      <div style={{ flexShrink: 0, alignSelf: isMobile ? "stretch" : "center" }}>
        <select
          value={filterDept}
          onChange={e => onDeptChange(e.target.value)}
          style={{
            padding: "7px 12px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--ts)",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <option value="all">Semua Departemen</option>
          {departments.filter(d => d !== "all").map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}