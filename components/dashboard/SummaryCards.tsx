"use client";

import { accentMap } from "@/lib/summary-cards";
import TrendIcon from "@/components/ui/TrendIcon";

interface SummaryCardsProps {
  data: any;
  isMobile?: boolean;
  isTablet?: boolean;
}

export default function SummaryCards({ data, isMobile, isTablet }: SummaryCardsProps) {
  // Solusi: Di mode mobile (HP), kita buat 1 kolom penuh (1fr). Tablet 2 kolom, Desktop 4 kolom.
  const cols = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";

  // Format angka ke Rupiah
  const formatRupiah = (angka: number | string) => {
    if (!angka) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(angka));
  };

  const cards = [
    {
      label: "Total Transaksi",
      value: data?.totalTransactions ?? 0,
      sub: "Bulan ini",
      trend: (data?.trends?.totalTransactionsTrend === "down" ? "down" : "up") as "up" | "down",
      trendVal: data?.trends?.totalTransactionsPercent,
      accent: "default" as const,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
    },
    {
      label: "Perlu Review",
      value: data?.needsReview ?? 0,
      sub: "Menunggu tindakan",
      trend: (data?.trends?.pendingReviewTrend === "up" ? "up" : "down") as "up" | "down",
      trendVal: data?.trends?.pendingReviewPercent,
      accent: "warning" as const,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    },
    {
      label: "High Alert",
      value: data?.highAlert ?? 0,
      sub: "Skor Fraud > 70",
      trend: (data?.trends?.highAlertsTrend === "down" ? "down" : "up") as "up" | "down",
      trendVal: data?.trends?.highAlertsPercent,
      accent: "danger" as const,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    },
    {
      label: "Nilai Berisiko",
      value: formatRupiah(data?.riskyAmountTotal ?? 0),
      sub: "Estimasi kerugian",
      trend: (data?.trends?.exposureTrend === "down" ? "down" : "up") as "up" | "down",
      trendVal: data?.trends?.exposurePercent,
      accent: "default" as const,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap: isMobile ? "12px" : "16px" }}>
      {cards.map((card) => {
        const a = accentMap[card.accent ?? "default"];
        
        const hasTrend = card.trendVal && card.trendVal !== "0%" && card.trendVal !== "+0%" && card.trendVal !== "-0%";

        return (
          <div key={card.label} style={{
              background: a.bg, border: `1px solid ${a.border}`, borderRadius: isMobile ? "12px" : "16px",
              padding: isMobile ? "16px 20px" : "20px 22px", display: "flex", flexDirection: "column",
              gap: isMobile ? "10px" : "14px", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: isMobile ? "12px" : "12px", fontWeight: 500, color: "var(--ts)", lineHeight: 1.3, paddingRight: "4px" }}>
                {card.label}
              </span>
              <div style={{ width: isMobile ? "30px" : "34px", height: isMobile ? "30px" : "34px", borderRadius: "9px", background: a.icon, display: "flex", alignItems: "center", justifyContent: "center", color: a.iconColor, flexShrink: 0 }}>
                {card.icon}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "24px" : "28px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-1px", lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>{card.sub}</div>
            </div>
            
            {/* Bagian Tren Hanya Dirender Kalau Punya Data, Teks Placeholder Dihapus */}
            {hasTrend && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 500, color: a.trend, paddingTop: "8px", borderTop: `1px solid ${a.border}` }}>
                <TrendIcon trend={card.trend} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.trendVal}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}