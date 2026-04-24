"use client"

interface QuickActionsProps {
  isMobile?: boolean;
}

export default function QuickActions({ isMobile }: QuickActionsProps) {
  return (
    <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
      <a
        href="/dashboard/import"
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: isMobile ? "8px 12px" : "9px 16px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          background: "var(--surface-2)",
          fontSize: isMobile ? "12px" : "13px",
          color: "var(--ts)",
          textDecoration: "none", fontWeight: 400,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--em)";
          (e.currentTarget as HTMLElement).style.color = "var(--em)";
          (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.color = "var(--ts)";
          (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        {isMobile ? "Import" : "Import CSV"}
      </a>

      <a
        href="/dashboard/report"
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: isMobile ? "8px 12px" : "9px 16px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, var(--em) 0%, var(--em2) 100%)",
          border: "none",
          fontSize: isMobile ? "12px" : "13px",
          color: "#fff",
          textDecoration: "none", fontWeight: 500,
          boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(16,185,129,0.35)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(16,185,129,0.25)";
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        {isMobile ? "Laporan" : "Buat Laporan"}
      </a>
    </div>
  );
}