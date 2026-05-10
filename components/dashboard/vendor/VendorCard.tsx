"use client";

export const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
  active:      { label: "Aktif",       color: "var(--em)", bg: "var(--em-subtle)",        border: "rgba(16,185,129,0.20)",  dot: "#10b981" },
  inactive:    { label: "Nonaktif",    color: "#d97706",   bg: "rgba(245,158,11,0.08)",   border: "rgba(245,158,11,0.20)",  dot: "#f59e0b" },
  blacklisted: { label: "Blacklisted", color: "#dc2626",   bg: "rgba(239,68,68,0.08)",    border: "rgba(239,68,68,0.20)",   dot: "#ef4444" },
};

interface VendorCardProps {
  vendor: any;
  onClick: () => void;
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  const sc = statusConfig[vendor.status] ?? statusConfig.inactive;
  const createdAt = vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString("id-ID") : "—";

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card-bg)", border: "1px solid var(--card-b)",
        borderRadius: "16px", padding: "20px",
        cursor: "pointer", transition: "transform 0.18s, border-color 0.18s, box-shadow 0.18s",
        display: "flex", flexDirection: "column", gap: "14px",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--card-b)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "10px", color: "var(--em)", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "3px", textTransform: "uppercase" }}>
            {vendor.id?.slice(0, 8)}...
          </div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--tp)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {vendor.vendorName}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.dot }} />
          <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>
            {sc.label}
          </span>
        </div>
      </div>

      {/* Metadata preview jika ada */}
      {vendor.metadata && Object.keys(vendor.metadata).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {Object.entries(vendor.metadata).slice(0, 3).map(([key, val]) => (
            <span key={key} style={{
              padding: "2px 8px", borderRadius: "6px",
              background: "var(--surface-2)", border: "1px solid var(--border)",
              fontSize: "10px", color: "var(--ts)",
            }}>
              {key}: {String(val)}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: "11px", color: "var(--tm)" }}>Terdaftar: {createdAt}</span>
        <span style={{ fontSize: "11px", color: "var(--em)", fontWeight: 500 }}>Lihat detail →</span>
      </div>
    </div>
  );
}