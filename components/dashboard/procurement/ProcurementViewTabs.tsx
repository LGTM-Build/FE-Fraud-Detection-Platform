import { VIEW_TABS_CONFIG, type ViewTab } from "@/data/procurement";

interface ViewTabsProps {
  activeTab: ViewTab;
  reviewCount: number;
  historyCount: number;
  onTabChange: (tab: ViewTab) => void;
}

export default function ProcurementViewTabs({
  activeTab,
  reviewCount,
  historyCount,
  onTabChange,
}: ViewTabsProps) {
  return (
    <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--border)" }}>
      {VIEW_TABS_CONFIG.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = tab.key === "review" ? reviewCount : historyCount;
        const alert = tab.key === "review" && reviewCount > 0;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 16px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--tp)" : "var(--tm)",
              borderBottom: isActive ? "2px solid var(--em)" : "2px solid transparent",
              marginBottom: "-1px",
              transition: "all 0.15s",
            }}
          >
            {tab.label}
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                padding: "1px 7px",
                borderRadius: "100px",
                background:
                  alert && isActive
                    ? "rgba(239,68,68,0.12)"
                    : isActive
                    ? "var(--em-subtle)"
                    : "var(--surface-2)",
                color:
                  alert && isActive
                    ? "#dc2626"
                    : isActive
                    ? "var(--em)"
                    : "var(--tm)",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}