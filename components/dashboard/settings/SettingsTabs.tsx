import { Tab, TABS } from "@/components/dashboard/settings/types";

interface SettingsTabsProps {
  tab: Tab;
  onChange: (t: Tab) => void;
  isMobile?: boolean;
}

export function SettingsTabs({ tab, onChange, isMobile }: SettingsTabsProps) {
  return (
    <div style={{
      display: "flex", gap: "4px",
      background: "var(--card-bg)", border: "1px solid var(--card-b)",
      borderRadius: "14px", padding: "5px",
      overflowX: isMobile ? "auto" : "visible",
      width: isMobile ? "100%" : "fit-content",
      scrollbarWidth: "none", msOverflowStyle: "none",
    }}>
      {TABS.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          padding: isMobile ? "7px 12px" : "8px 18px",
          borderRadius: "10px", border: "none",
          fontSize: isMobile ? "12px" : "13px",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontWeight: tab === t.key ? 500 : 400, transition: "all 0.15s",
          background: tab === t.key ? "var(--em-subtle-2)" : "transparent",
          color: tab === t.key ? "var(--em)" : "var(--tm)",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}