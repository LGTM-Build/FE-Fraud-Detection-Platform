import { Vendor, statusConfig } from "@/data/vendors";
import { RiskMeter } from "@/components/dashboard/vendor/RiskMeter";
import { fmt, StatusConfig } from "@/data/vendors";

interface VendorDetailProps {
  vendor: Vendor;
  onClose: () => void;
}

export function VendorDetail({ vendor, onClose }: VendorDetailProps) {
  const sc = statusConfig[vendor.status];

  const scoreBg = vendor.riskScore >= 70 ? "rgba(239,68,68,0.06)" : vendor.riskScore >= 40 ? "rgba(245,158,11,0.06)" : "rgba(16,185,129,0.06)";
  const scoreBorder = vendor.riskScore >= 70 ? "rgba(239,68,68,0.18)" : vendor.riskScore >= 40 ? "rgba(245,158,11,0.18)" : "rgba(16,185,129,0.18)";

  const infoRows = [
    { label: "NPWP",               value: vendor.taxId },
    { label: "Terdaftar",          value: vendor.registeredDate },
    { label: "Kategori",           value: vendor.category },
    { label: "Alamat",             value: vendor.address },
    { label: "Kontak",             value: vendor.contact },
    { label: "Transaksi Terakhir", value: vendor.lastTransaction },
  ];

  const stats = [
    { label: "Total Transaksi", value: vendor.totalTransactions.toString() },
    { label: "Total Nilai",     value: fmt(vendor.totalValue) },
    { label: "Di-flag",         value: vendor.flaggedTransactions.toString(), alert: vendor.flaggedTransactions > 0 },
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />

      {/* Drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201, width: "460px", background: "var(--bg)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>

        <DrawerHeader vendor={vendor} sc={sc} onClose={onClose} />

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Risk score */}
          <div style={{ padding: "16px 20px", borderRadius: "12px", background: scoreBg, border: `1px solid ${scoreBorder}` }}>
            <RiskMeter score={vendor.riskScore} />
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ padding: "12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: s.alert ? "#dc2626" : "var(--tp)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "var(--tm)", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Fraud flags */}
          {vendor.fraudFlags.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Fraud Flags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {vendor.fraudFlags.map((f) => (
                  <span key={f} style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Relations */}
          {vendor.relations.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
                Relasi Karyawan Internal
              </div>
              {vendor.relations.map((r, i) => (
                <div key={i} style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{r.employeeName}</div>
                    <div style={{ fontSize: "11px", color: "var(--tm)" }}>{r.employeeRole}</div>
                    <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: 500, marginTop: "2px" }}>⚠ {r.relationType}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info rows */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Info Vendor</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {infoRows.map((row, i) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < infoRows.length - 1 ? "1px solid var(--border)" : "none", gap: "16px" }}>
                  <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: "12px", color: "var(--ts)", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Catatan Auditor</div>
              <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.65, fontWeight: 300 }}>{vendor.notes}</p>
            </div>
          )}
        </div>

        <DrawerActions />
      </div>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function DrawerHeader({ vendor, sc, onClose }: { vendor: Vendor; sc: StatusConfig; onClose: () => void }) {
  return (
    <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "11px", color: "var(--em)", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "4px" }}>{vendor.id}</div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px", marginBottom: "6px", lineHeight: 1.2 }}>
          {vendor.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.dot }} />
          <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>
            {sc.label}
          </span>
        </div>
      </div>
      <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

function DrawerActions() {
  return (
    <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "2px" }}>Ubah Status Vendor</div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.30)", background: "rgba(16,185,129,0.06)", color: "var(--em)", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ✓ Active
        </button>
        <button style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid rgba(245,158,11,0.30)", background: "rgba(245,158,11,0.06)", color: "#d97706", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ⚠ Watchlist
        </button>
        <button style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.30)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ✕ Blacklist
        </button>
      </div>
    </div>
  );
}