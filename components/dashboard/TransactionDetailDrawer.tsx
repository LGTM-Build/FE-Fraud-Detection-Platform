"use client";
import { useState } from "react";
import Link from "next/link";

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tx: any | null;
  isMobile?: boolean;
}

const APP_STATUS_CONFIG: Record<string, any> = {
  pending: { label: "Pending", bg: "rgba(245,158,11,0.08)", color: "#d97706", border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  approved: { label: "Approved", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  auto_approved: { label: "Auto-Approved", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#dc2626" },
  escalated: { label: "Escalated", bg: "rgba(99,102,241,0.08)", color: "#6366f1", border: "rgba(99,102,241,0.20)", dot: "#6366f1" },
};

const getFraudRiskConfig = (score: number | null) => {
  if (score === null || score === undefined) return { label: "Menunggu", color: "#6366f1", bg: "rgba(99,102,241,0.05)", border: "rgba(99,102,241,0.15)" };
  if (score >= 70) return { label: "Risiko Tinggi", color: "#dc2626", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" };
  if (score >= 40) return { label: "Risiko Sedang", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" };
  return { label: "Risiko Rendah", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" };
};

export default function TransactionDetailDrawer({ isOpen, onClose, tx, isMobile }: DetailDrawerProps) {
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);

  if (!isOpen || !tx) return null;

  // Normalisasi Data API Dashboard
  const txStatus = (tx.status || "pending").toLowerCase();
  const sc = APP_STATUS_CONFIG[txStatus] || APP_STATUS_CONFIG.pending;
  const risk = getFraudRiskConfig(tx.fraudScore);
  const canAct = txStatus === "pending" || txStatus.includes("alert");

  const moduleType = (tx.module || tx.type || "").toLowerCase();
  const isProcurement = moduleType.includes("procurement") || moduleType.includes("pengadaan");
  const moduleName = isProcurement ? "Pengadaan" : "Pengeluaran";
  const targetPage = isProcurement ? "/dashboard/procurement" : "/dashboard/expense";

  // Parse Karyawan & Vendor dari subDescription
  let employeeName = "—", vendorName = "—";
  if (tx.subDescription) {
    if (tx.subDescription.includes(" · ")) {
      const parts = tx.subDescription.split(" · ");
      employeeName = parts[0] === "-" ? "—" : parts[0];
      vendorName = parts[1];
    } else employeeName = tx.subDescription;
  }

  const fmtAmount = tx.amountTotal ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(tx.amountTotal)) : "Rp 0";
  const fmtDate = tx.date ?? tx.createdAt ? new Date(tx.date ?? tx.createdAt).toLocaleDateString("id-ID") : "—";
  
  const safeFlags = Array.isArray(tx.flags) ? tx.flags : typeof tx.flags === "string" && tx.flags.length > 0 ? tx.flags.split(",").map((s: string) => s.trim()) : [];

  const detailRows = [
    { label: "Deskripsi",   value: tx.description ?? "—" },
    { label: "Modul",       value: moduleName },
    { label: "Vendor / Mitra", value: vendorName },
    { label: "Karyawan",    value: employeeName },
    { label: "Tanggal",     value: fmtDate },
    { label: "Total",       value: fmtAmount, highlight: true },
  ];

  const handleAction = async (type: "approve" | "reject") => {
    setActionLoading(type);
    await new Promise(res => setTimeout(res, 800)); // Simulasi API
    alert(`Tindakan ${type} berhasil dicatat (Mode Simulasi)`);
    setActionLoading(null);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />
      <style>{`
        @keyframes fadeIn       { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp      { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom{ from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>

      {isMobile ? (
        <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201, background: "var(--bg)", borderRadius: "20px 20px 0 0", borderTop: "1px solid var(--border)", boxShadow: "0 -16px 48px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} />
          </div>
          <MobileHeader tx={tx} sc={sc} onClose={onClose} moduleName={moduleName} />
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <MobileBody tx={tx} risk={risk} detailRows={detailRows} sc={sc} safeFlags={safeFlags} targetPage={targetPage} moduleName={moduleName} />
          </div>
          {canAct && <ModalActions isMobile onApprove={() => handleAction("approve")} onReject={() => handleAction("reject")} actionLoading={actionLoading} targetPage={targetPage} moduleName={moduleName} />}
        </div>
      ) : (
        <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", pointerEvents: "none" }}>
          <div onClick={e => e.stopPropagation()} style={{ pointerEvents: "auto", width: "100%", maxWidth: "860px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }}>
            <DesktopHeader tx={tx} sc={sc} onClose={onClose} />
            <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

              {/* Left: skor + analisis AI + temuan */}
              <div style={{ padding: "24px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ padding: "20px", borderRadius: "14px", background: risk.bg, border: `1px solid ${risk.border}` }}>
                  <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px" }}>Skor Kecurangan</div>
                  {tx.fraudScore !== null && tx.fraudScore !== undefined ? (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "12px" }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "56px", fontWeight: 800, color: risk.color, lineHeight: 1 }}>{tx.fraudScore}</span>
                      <div style={{ flex: 1, paddingBottom: "6px" }}>
                        <div style={{ height: "8px", borderRadius: "4px", background: "var(--border)", overflow: "hidden", marginBottom: "6px" }}>
                          <div style={{ width: `${tx.fraudScore}%`, height: "100%", background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`, borderRadius: "4px" }} />
                        </div>
                        <div style={{ fontSize: "12px", color: risk.color, fontWeight: 500 }}>{risk.label}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" style={{ animation: "spin 2s linear infinite" }}>
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#6366f1" }}>Sedang Dianalisis</div>
                        <div style={{ fontSize: "12px", color: "var(--tm)", marginTop: "2px" }}>AI sedang memproses data ini</div>
                      </div>
                      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
                    </div>
                  )}
                </div>

                <div style={{ padding: "16px 18px", borderRadius: "14px", background: "var(--surface-2)", border: "1px solid var(--border)", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                    </svg>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Analisis AI</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.7, fontWeight: 300 }}>
                    {tx.aiExplanation ?? "Analisis AI belum tersedia. Data masih dalam proses."}
                  </p>
                </div>

                {safeFlags.length > 0 && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Temuan AI</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {safeFlags.map((f: string) => (
                        <span key={f} style={{ padding: "5px 14px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: detail + status */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "12px" }}>Detail Transaksi</div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {detailRows.map((row, i) => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < detailRows.length - 1 ? "1px solid var(--border)" : "none", gap: "16px" }}>
                        <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
                        <span style={{ fontSize: row.highlight ? "15px" : "13px", fontWeight: row.highlight ? 700 : 400, color: row.highlight ? "var(--tp)" : "var(--ts)", textAlign: "right" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "var(--tm)" }}>Status:</span>
                  <span style={{ padding: "4px 14px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "12px", fontWeight: 500 }}>{sc.label}</span>
                </div>
              </div>
            </div>
            {canAct && <ModalActions onApprove={() => handleAction("approve")} onReject={() => handleAction("reject")} actionLoading={actionLoading} targetPage={targetPage} moduleName={moduleName} />}
          </div>
        </div>
      )}
    </>
  );
}

// Sub-components
function DesktopHeader({ tx, sc, onClose }: any) {
  return (
    <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "16px", background: "var(--surface-2)", flexShrink: 0 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--em)" }}>{tx.code || tx.id.slice(0, 8)}</span>
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
          {tx.description}
        </h3>
      </div>
      <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0, transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--em)"; e.currentTarget.style.color = "var(--em)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ts)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

function MobileHeader({ tx, sc, onClose, moduleName }: any) {
  return (
    <div style={{ padding: "12px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--em)" }}>{tx.code || tx.id.slice(0, 8)}</span>
          <span style={{ padding: "2px 8px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "10px", fontWeight: 500 }}>{sc.label}</span>
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px", margin: 0 }}>Detail {moduleName}</h3>
      </div>
      <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

function MobileBody({ tx, risk, detailRows, sc, safeFlags }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "16px", borderRadius: "12px", background: risk.bg, border: `1px solid ${risk.border}` }}>
        <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>Skor Kecurangan</div>
        {tx.fraudScore !== null && tx.fraudScore !== undefined ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "40px", fontWeight: 800, color: risk.color, lineHeight: 1 }}>{tx.fraudScore}</span>
            <div style={{ flex: 1 }}>
              <div style={{ height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden", marginBottom: "6px" }}>
                <div style={{ width: `${tx.fraudScore}%`, height: "100%", background: risk.color, borderRadius: "3px" }} />
              </div>
              <div style={{ fontSize: "11px", color: risk.color, fontWeight: 500 }}>{risk.label}</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: "13px", color: "#6366f1" }}>Sedang dianalisis AI…</div>
        )}
      </div>

      <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Analisis AI</span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
          {tx.aiExplanation ?? "Analisis AI belum tersedia."}
        </p>
      </div>

      {safeFlags.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Temuan AI</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {safeFlags.map((f: string) => <span key={f} style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>)}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Detail Transaksi</div>
        {detailRows.map((row: any, i: number) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < detailRows.length - 1 ? "1px solid var(--border)" : "none", gap: "16px" }}>
            <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontSize: row.highlight ? "14px" : "13px", fontWeight: row.highlight ? 600 : 400, color: row.highlight ? "var(--tp)" : "var(--ts)", textAlign: "right" }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "12px", color: "var(--tm)" }}>Status:</span>
        <span style={{ padding: "4px 12px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "12px", fontWeight: 500 }}>{sc.label}</span>
      </div>
    </div>
  );
}

function ModalActions({ isMobile, onApprove, onReject, actionLoading, targetPage, moduleName }: any) {
  return (
    <div style={{ padding: isMobile ? "16px" : "20px 28px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px", background: "var(--surface-2)", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         <div style={{ fontSize: "11px", color: "var(--tm)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>Tindakan Auditor</div>
         <Link href={targetPage} style={{ fontSize: "12px", color: "var(--em)", textDecoration: "none", fontWeight: 600 }}>Cek modul {moduleName} →</Link>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onApprove} disabled={actionLoading !== null}
          style={{ flex: 1, padding: isMobile ? "10px" : "11px", borderRadius: "10px", border: "none", background: actionLoading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: actionLoading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: actionLoading ? "none" : "0 4px 16px rgba(16,185,129,0.25)", transition: "all 0.15s" }}>
          {actionLoading === "approve" ? "Menyimpan..." : "✓ Setujui"}
        </button>
        <button onClick={onReject} disabled={actionLoading !== null}
          style={{ flex: 1, padding: isMobile ? "10px" : "11px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.30)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "13px", fontWeight: 500, cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: actionLoading ? 0.6 : 1 }}>
          {actionLoading === "reject" ? "Menyimpan..." : "✕ Tolak"}
        </button>
      </div>
    </div>
  );
}