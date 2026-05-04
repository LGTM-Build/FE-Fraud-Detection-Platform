import { useState } from "react";
import {
  ProcurementTransaction, statusConfig, fmt, fmtDate,
  getFraudRiskConfig, procurementMethodLabels,
} from "@/data/procurement";

type StatusConfigItem = (typeof statusConfig)[keyof typeof statusConfig];

interface DetailModalProps {
  tx: ProcurementTransaction;
  onClose: () => void;
  isMobile?: boolean;
  // TODO integrasi: sambungkan ke PATCH /api/procurement-transactions/:id/status
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onEscalate?: (id: string) => Promise<void>;
}

export function DetailModal({ tx, onClose, isMobile, onApprove, onReject, onEscalate }: DetailModalProps) {
  const sc   = statusConfig[tx.status];
  const risk = getFraudRiskConfig(tx.fraudScore);
  const canAct = tx.status === "alert" || tx.status === "high_alert";

  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | "escalate" | null>(null);

  const handleAction = async (type: "approve" | "reject" | "escalate") => {
    const fn = type === "approve" ? onApprove : type === "reject" ? onReject : onEscalate;
    if (!fn) return;
    setActionLoading(type);
    try { await fn(tx.id); onClose(); }
    finally { setActionLoading(null); }
  };

  const detailRows = [
    { label: "Item",        value: tx.itemDescription },
    { label: "Departemen",  value: tx.department ?? "—" },
    { label: "Karyawan",    value: tx.employeeName ?? "—" },
    { label: "Diinput oleh",value: tx.requesterName },
    { label: "Direview oleh",value: tx.reviewerName ?? "Belum direview" },
    { label: "Metode",      value: procurementMethodLabels[tx.procurementMethod] ?? tx.procurementMethod },
    { label: "Tanggal",     value: fmtDate(tx.purchaseDate) },
    { label: "Total",       value: fmt(tx.amountTotal), highlight: true },
  ];

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
          <MobileHeader tx={tx} sc={sc} onClose={onClose} />
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <MobileBody tx={tx} risk={risk} detailRows={detailRows} sc={sc} />
          </div>
          {canAct && <ModalActions isMobile onApprove={() => handleAction("approve")} onReject={() => handleAction("reject")} onEscalate={() => handleAction("escalate")} actionLoading={actionLoading} />}
        </div>
      ) : (
        <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", pointerEvents: "none" }}>
          <div onClick={e => e.stopPropagation()} style={{ pointerEvents: "auto", width: "100%", maxWidth: "860px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", overflow: "hidden", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }}>
            <DesktopHeader tx={tx} sc={sc} onClose={onClose} />
            <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

              {/* Left: skor + analisis AI + temuan */}
              <div style={{ padding: "24px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Skor */}
                <div style={{ padding: "20px", borderRadius: "14px", background: risk.bg, border: `1px solid ${risk.border}` }}>
                  <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px" }}>Skor Kecurangan</div>
                  {tx.fraudScore !== null ? (
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

                {/* Analisis AI */}
                <div style={{ padding: "16px 18px", borderRadius: "14px", background: "var(--surface-2)", border: "1px solid var(--border)", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                    </svg>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Analisis AI</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.7, fontWeight: 300 }}>
                    {tx.aiExplanation ?? "Analisis AI belum tersedia. Data masih dalam antrean pemrosesan."}
                  </p>
                </div>

                {/* Temuan AI */}
                {tx.flags.length > 0 && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Temuan AI</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {tx.flags.map(f => (
                        <span key={f} style={{ padding: "5px 14px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: vendor + detail + status */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Info Vendor</div>
                  <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--tp)" }}>{tx.vendorName}</div>
                  </div>
                </div>

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
                  <span style={{ fontSize: "13px", color: "var(--tm)" }}>Status saat ini:</span>
                  <span style={{ padding: "4px 14px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "12px", fontWeight: 500 }}>{sc.label}</span>
                </div>
              </div>
            </div>
            {canAct && <ModalActions onApprove={() => handleAction("approve")} onReject={() => handleAction("reject")} onEscalate={() => handleAction("escalate")} actionLoading={actionLoading} />}
          </div>
        </div>
      )}
    </>
  );
}

function DesktopHeader({ tx, sc, onClose }: Readonly<{ tx: ProcurementTransaction; sc: StatusConfigItem; onClose: () => void }>) {
  return (
    <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "16px", background: "var(--surface-2)", flexShrink: 0 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--em)" }}>{tx.purchaseId ?? tx.id.slice(0, 8)}</span>
          <span style={{ fontSize: "12px", color: "var(--tm)" }}>{fmtDate(tx.purchaseDate)}</span>
          <span style={{ padding: "2px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>{sc.label}</span>
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {tx.itemDescription}
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

function MobileHeader({ tx, sc, onClose }: { tx: ProcurementTransaction; sc: any; onClose: () => void }) {
  return (
    <div style={{ padding: "12px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--em)" }}>{tx.purchaseId ?? tx.id.slice(0, 8)}</span>
          <span style={{ padding: "2px 8px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "10px", fontWeight: 500 }}>{sc.label}</span>
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px" }}>Detail Pengadaan</h3>
      </div>
      <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

function MobileBody({ tx, risk, detailRows, sc }: { tx: ProcurementTransaction; risk: ReturnType<typeof getFraudRiskConfig>; detailRows: { label: string; value: string; highlight?: boolean }[]; sc: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "16px", borderRadius: "12px", background: risk.bg, border: `1px solid ${risk.border}` }}>
        <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>Skor Kecurangan</div>
        {tx.fraudScore !== null ? (
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
        <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.65, fontWeight: 300 }}>
          {tx.aiExplanation ?? "Analisis AI belum tersedia. Data masih dalam antrean pemrosesan."}
        </p>
      </div>

      {tx.flags.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Temuan AI</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {tx.flags.map(f => <span key={f} style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>)}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Detail Transaksi</div>
        {detailRows.map((row, i) => (
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

function ModalActions({ isMobile, onApprove, onReject, onEscalate, actionLoading }: {
  isMobile?: boolean;
  onApprove: () => void;
  onReject: () => void;
  onEscalate: () => void;
  actionLoading: "approve" | "reject" | "escalate" | null;
}) {
  return (
    <div style={{ padding: isMobile ? "16px" : "20px 28px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px", background: "var(--surface-2)", flexShrink: 0 }}>
      <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>Tindakan Auditor</div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={onApprove} disabled={actionLoading !== null}
          style={{ flex: 1, padding: isMobile ? "10px" : "11px", borderRadius: "10px", border: "none", background: actionLoading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: actionLoading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 500, cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: actionLoading ? "none" : "0 4px 16px rgba(16,185,129,0.25)", transition: "all 0.15s" }}>
          {actionLoading === "approve" ? "Menyimpan..." : "✓ Setujui"}
        </button>
        <button onClick={onReject} disabled={actionLoading !== null}
          style={{ flex: 1, padding: isMobile ? "10px" : "11px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.30)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "13px", fontWeight: 500, cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: actionLoading ? 0.6 : 1 }}>
          {actionLoading === "reject" ? "Menyimpan..." : "✕ Tolak"}
        </button>
        <button onClick={onEscalate} disabled={actionLoading !== null}
          style={{ padding: isMobile ? "10px 14px" : "11px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--ts)", fontSize: "13px", fontWeight: 400, cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: actionLoading ? 0.6 : 1 }}>
          {actionLoading === "escalate" ? "..." : "↑ Eskalasi"}
        </button>
      </div>
    </div>
  );
}