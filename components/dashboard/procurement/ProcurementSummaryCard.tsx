"use client";
import { REVIEW_STATUSES, fmtCompact, type ProcurementTransaction } from "@/data/procurement";
import { accentMap } from "@/lib/summary-cards";

interface ProcurementSummaryCardsProps {
  data: ProcurementTransaction[];
  isMobile?: boolean;
  isTablet?: boolean;
}

export default function ProcurementSummaryCards({ data, isMobile, isTablet }: ProcurementSummaryCardsProps) {
  const cols = isMobile ? "repeat(2, 1fr)" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  const highAlertCount = data.filter(t => t.status === "high_alert").length;
  const alertCount     = data.filter(t => t.status === "alert").length;
  const approvedCount  = data.filter(t => t.status === "approved" || t.status === "auto_approved").length;
  const totalExposure  = data
    .filter(t => REVIEW_STATUSES.includes(t.status))
    .reduce((sum, t) => sum + t.amountTotal, 0);

  const cards = [
    {
      label: "Risiko Tinggi",
      value: String(highAlertCount),
      sub: "skor kecurangan > 70",
      accent: "danger" as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    {
      label: "Perlu Ditinjau",
      value: String(alertCount),
      sub: "menunggu tindakan auditor",
      accent: "warning" as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: "Disetujui",
      value: String(approvedCount),
      sub: "disetujui + disetujui otomatis",
      accent: "success" as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: "Nilai Berisiko",
      value: fmtCompact(totalExposure),
      sub: "estimasi total eksposur",
      accent: "default" as const,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? "10px" : "16px" }}>
      {cards.map(card => {
        const a = accentMap[card.accent];
        return (
          <div key={card.label} style={{
            background: a.bg, border: `1px solid ${a.border}`,
            borderRadius: isMobile ? "12px" : "16px",
            padding: isMobile ? "14px 16px" : "20px 22px",
            display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "14px",
            transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: isMobile ? "11px" : "12px", fontWeight: 500, color: "var(--ts)", lineHeight: 1.3, paddingRight: "4px" }}>
                {card.label}
              </span>
              <div style={{ width: isMobile ? "28px" : "34px", height: isMobile ? "28px" : "34px", borderRadius: "9px", background: a.icon, display: "flex", alignItems: "center", justifyContent: "center", color: a.iconColor, flexShrink: 0 }}>
                {card.icon}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "22px" : "28px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-1px", lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>{card.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}