"use client";

import { cards } from "@/data/summary-cards";
import { accentMap } from "@/lib/summary-cards";
import TrendIcon from "@/components/ui/TrendIcon";

export default function SummaryCards() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "16px",
    }}>
      {cards.map((card) => {
        const a = accentMap[card.accent ?? "default"];
        return (
          <div
            key={card.label}
            style={{
              background: a.bg,
              border: `1px solid ${a.border}`,
              borderRadius: "16px",
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--ts)", lineHeight: 1.3 }}>
                {card.label}
              </span>
              <div style={{
                width: "34px", height: "34px", borderRadius: "9px",
                background: a.icon,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: a.iconColor, flexShrink: 0,
              }}>
                {card.icon}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "28px", fontWeight: 800,
                color: "var(--tp)", letterSpacing: "-1px", lineHeight: 1,
              }}>
                {card.value}
              </div>
              <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>
                {card.sub}
              </div>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: 500,
              color: a.trend,
              paddingTop: "10px",
              borderTop: `1px solid ${a.border}`,
            }}>
              <TrendIcon trend={card.trend} />
              {card.trendVal}
            </div>
          </div>
        );
      })}
    </div>
  );
}