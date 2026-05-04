import { useState } from "react";
import {
  REVIEW_FILTERS_CONFIG,
  HISTORY_FILTERS_CONFIG,
  type ViewTab,
  type ReviewFilter,
  type HistoryFilter,
  type ProcurementTransaction,
} from "@/data/procurement";

interface FilterBarProps {
  activeTab: ViewTab;
  reviewFilter: ReviewFilter;
  historyFilter: HistoryFilter;
  filterBU: string;
  reviewData: ProcurementTransaction[];
  historyData: ProcurementTransaction[];
  businessUnits: string[];
  isMobile: boolean;
  onReviewFilterChange: (f: ReviewFilter) => void;
  onHistoryFilterChange: (f: HistoryFilter) => void;
  onBUChange: (bu: string) => void;
}

export default function ProcurementFilterBar({
  activeTab,
  reviewFilter,
  historyFilter,
  filterBU,
  reviewData,
  historyData,
  businessUnits,
  isMobile,
  onReviewFilterChange,
  onHistoryFilterChange,
  onBUChange,
}: FilterBarProps) {
  // State untuk custom dropdown
  const [buOpen, setBuOpen] = useState(false);

  const configs = activeTab === "review" ? REVIEW_FILTERS_CONFIG : HISTORY_FILTERS_CONFIG;
  const currentData = activeTab === "review" ? reviewData : historyData;

  // Opsi dropdown: Pastikan "all" selalu ada di atas
  const dropdownOptions = ["all", ...businessUnits.filter((d) => d !== "all")];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "6px",
        flexWrap: "wrap",
        background: "var(--card-bg)",
        border: "1px solid var(--card-b)",
        borderRadius: "14px",
        padding: "6px",
      }}
    >
      {/* ── Status filters ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          flex: 1,
          overflowX: isMobile ? "auto" : "visible",
          scrollbarWidth: "none",
        }}
      >
        {configs.map((f) => {
          const isActive =
            activeTab === "review" ? reviewFilter === f.key : historyFilter === f.key;
          const isAlert = f.key === "high-alert";
          const count =
            f.key === "all"
              ? currentData.length
              : currentData.filter((t) => t.status === f.key).length;

          return (
            <button
              key={f.key}
              onClick={() =>
                activeTab === "review"
                  ? onReviewFilterChange(f.key as ReviewFilter)
                  : onHistoryFilterChange(f.key as HistoryFilter)
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: isMobile ? "6px 10px" : "7px 14px",
                borderRadius: "10px",
                border: "none",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 500 : 400,
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: isActive
                  ? isAlert
                    ? "rgba(239,68,68,0.12)"
                    : "var(--em-subtle-2)"
                  : "transparent",
                color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)",
                transition: "all 0.15s",
              }}
            >
              {f.label}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "1px 6px",
                  borderRadius: "100px",
                  background: isActive
                    ? isAlert
                      ? "rgba(239,68,68,0.15)"
                      : "var(--em-subtle-2)"
                    : "var(--surface-2)",
                  color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Custom Select / Dropdown BU ────────────────────────────── */}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          alignSelf: isMobile ? "stretch" : "center",
          width: isMobile ? "100%" : "200px", // Kasih lebar fix di desktop agar rapi
        }}
      >
        <div
          onClick={() => setBuOpen(!buOpen)}
          onBlur={() => setTimeout(() => setBuOpen(false), 150)}
          tabIndex={0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 14px",
            borderRadius: "10px",
            border: buOpen ? "1px solid var(--em)" : "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--ts)",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            boxShadow: buOpen ? "0 0 0 3px var(--em-subtle)" : "none",
            transition: "all 0.2s",
            userSelect: "none",
          }}
        >
          <span style={{ fontWeight: filterBU !== "all" ? 500 : 400, color: filterBU !== "all" ? "var(--tp)" : "var(--ts)" }}>
            {filterBU === "all" ? "Semua Unit Bisnis" : filterBU}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transition: "transform 0.2s",
              transform: buOpen ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
              color: "var(--tm)"
            }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Dropdown Options */}
        {buOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              zIndex: 100,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
              maxHeight: "220px",
              overflowY: "auto",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {dropdownOptions.map((ind) => {
              const label = ind === "all" ? "Semua Unit Bisnis" : ind;
              const isSelected = filterBU === ind;

              return (
                <div
                  key={ind}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Mencegah onBlur berjalan sebelum onClick
                    onBUChange(ind);
                    setBuOpen(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontFamily: "'DM Sans', sans-serif",
                    color: isSelected ? "var(--em)" : "var(--tp)",
                    fontWeight: isSelected ? 500 : 400,
                    background: isSelected ? "var(--em-subtle)" : "transparent",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "var(--em-subtle)";
                      e.currentTarget.style.color = "var(--em)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--tp)";
                    }
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}