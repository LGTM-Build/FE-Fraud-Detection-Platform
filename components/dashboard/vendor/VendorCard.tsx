import { Vendor, statusConfig, fmt } from "@/data/vendors";

interface VendorCardProps {
  vendor: Vendor;
  onClick: () => void;
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  const sc = statusConfig[vendor.status];
  const scoreColor = vendor.riskScore >= 70 ? "#ef4444" : vendor.riskScore >= 40 ? "#f59e0b" : "#10b981";

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card-bg)", border: "1px solid var(--card-b)",
        borderRadius: "16px", padding: "20px",
        cursor: "pointer", transition: "transform 0.18s, border-color 0.18s, box-shadow 0.18s",
        display: "flex", flexDirection: "column", gap: "16px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--card-b)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "10px", color: "var(--em)", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "3px" }}>{vendor.id}</div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--tp)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {vendor.name}
          </div>
          <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{vendor.category}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.dot }} />
          <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>
            {sc.label}
          </span>
        </div>
      </div>

      {/* Risk score mini */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ fontSize: "11px", color: "var(--tm)" }}>Risk Score</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: scoreColor }}>{vendor.riskScore}</span>
        </div>
        <div style={{ height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden" }}>
          <div style={{ width: `${vendor.riskScore}%`, height: "100%", background: scoreColor, borderRadius: "2px" }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[
          { label: "Transaksi", value: vendor.totalTransactions.toString() },
          { label: "Nilai", value: fmt(vendor.totalValue) },
          { label: "Di-flag", value: vendor.flaggedTransactions.toString(), alert: vendor.flaggedTransactions > 0 },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center", padding: "8px 6px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: s.alert ? "#dc2626" : "var(--tp)", fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "var(--tm)", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Flags preview */}
      {vendor.fraudFlags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {vendor.fraudFlags.slice(0, 2).map((f) => (
            <span key={f} style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", fontSize: "10px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
          ))}
          {vendor.fraudFlags.length > 2 && (
            <span style={{ padding: "2px 8px", borderRadius: "100px", background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: "10px", color: "var(--tm)" }}>
              +{vendor.fraudFlags.length - 2} lainnya
            </span>
          )}
        </div>
      )}

      {/* Relation warning */}
      {vendor.relations.length > 0 && (
        <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 500 }}>
            Conflict of Interest — {vendor.relations[0].relationType}
          </span>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: "11px", color: "var(--tm)" }}>Transaksi terakhir: {vendor.lastTransaction}</span>
        <span style={{ fontSize: "11px", color: "var(--em)", fontWeight: 500 }}>Lihat profil →</span>
      </div>
    </div>
  );
}