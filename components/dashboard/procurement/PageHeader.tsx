interface PageHeaderProps { isMobile?: boolean; }

export function PageHeader({ isMobile }: PageHeaderProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between", gap: "12px",
    }}>
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
          Procurement Monitor
        </h1>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
          Monitor dan review transaksi pengadaan vendor
        </p>
      </div>
      <a href="/dashboard/import" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: isMobile ? "8px 14px" : "9px 16px", borderRadius: "10px",
        background: "linear-gradient(135deg, var(--em), var(--em2))",
        color: "#fff", fontSize: "13px", fontWeight: 500,
        textDecoration: "none", boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
        alignSelf: isMobile ? "flex-start" : "auto",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Import CSV
      </a>
    </div>
  );
}