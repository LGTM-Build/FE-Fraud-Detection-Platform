import { ProcurementTransaction, statusConfig, fmt } from "@/data/procurement";

interface DetailModalProps {
  tx: ProcurementTransaction;
  onClose: () => void;
  isMobile?: boolean;
}

export function DetailModal({ tx, onClose, isMobile }: DetailModalProps) {
  const sc = statusConfig[tx.status];
  const scoreColor = tx.fraudScore >= 70 ? "#ef4444" : tx.fraudScore >= 30 ? "#f59e0b" : "#10b981";
  const scoreBg = tx.fraudScore >= 70 ? "rgba(239,68,68,0.07)" : tx.fraudScore >= 30 ? "rgba(245,158,11,0.07)" : "rgba(16,185,129,0.07)";
  const scoreBorder = tx.fraudScore >= 70 ? "rgba(239,68,68,0.18)" : tx.fraudScore >= 30 ? "rgba(245,158,11,0.18)" : "rgba(16,185,129,0.18)";
  const scoreLabel = tx.fraudScore >= 70 ? "High Risk — perlu tindakan segera" : tx.fraudScore >= 30 ? "Medium Risk — perlu review" : "Low Risk — aman";

  const detailRows = [
    { label: "Item",       value: tx.itemDescription },
    { label: "Unit Bisnis", value: tx.businessUnit },
    { label: "Requester",  value: tx.requester },
    { label: "Approver",   value: tx.approver },
    { label: "Metode",     value: tx.procurementMethod },
    { label: "Tanggal",    value: tx.date },
    { label: "Total",      value: fmt(tx.amount), highlight: true },
  ];

  const canAct = tx.status === "pending" || tx.status === "high-alert";

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
      }} />

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>

      {isMobile ? (
        /* Bottom sheet */
        <div style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
          background: "var(--bg)", borderRadius: "20px 20px 0 0",
          borderTop: "1px solid var(--border)",
          boxShadow: "0 -16px 48px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column", maxHeight: "90vh",
          animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} />
          </div>
          <MobileHeader tx={tx} sc={sc} onClose={onClose} />
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <MobileBody tx={tx} scoreColor={scoreColor} scoreBg={scoreBg} scoreBorder={scoreBorder} scoreLabel={scoreLabel} detailRows={detailRows} sc={sc} />
          </div>
          {canAct && <ModalActions isMobile />}
        </div>
      ) : (
        /* Centered modal */
        <div style={{
          position: "fixed", inset: 0, zIndex: 201,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px", pointerEvents: "none",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: "860px",
            maxHeight: "calc(100vh - 48px)",
            background: "var(--bg)", borderRadius: "20px",
            border: "1px solid var(--border)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.04)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <DesktopHeader tx={tx} sc={sc} onClose={onClose} />

            <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {/* Left: score + AI + flags */}
              <div style={{ padding: "24px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Score */}
                <div style={{ padding: "20px", borderRadius: "14px", background: scoreBg, border: `1px solid ${scoreBorder}` }}>
                  <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px" }}>Fraud Score</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "12px" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "56px", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{tx.fraudScore}</span>
                    <div style={{ flex: 1, paddingBottom: "6px" }}>
                      <div style={{ height: "8px", borderRadius: "4px", background: "var(--border)", overflow: "hidden", marginBottom: "6px" }}>
                        <div style={{ width: `${tx.fraudScore}%`, height: "100%", background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`, borderRadius: "4px" }} />
                      </div>
                      <div style={{ fontSize: "12px", color: scoreColor, fontWeight: 500 }}>{scoreLabel}</div>
                    </div>
                  </div>
                </div>

                {/* AI */}
                <div style={{ padding: "16px 18px", borderRadius: "14px", background: "var(--surface-2)", border: "1px solid var(--border)", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                    </svg>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Analisis AI</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.7, fontWeight: 300 }}>{tx.aiExplanation}</p>
                </div>

                {/* Flags */}
                {tx.flags.length > 0 && (
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Fraud Flags</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {tx.flags.map(f => <span key={f} style={{ padding: "5px 14px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: vendor info + transaction details + status */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Vendor */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Info Vendor</div>
                  <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>Nama Vendor</span>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{tx.vendorName}</span>
                    </div>
                    <div style={{ height: "1px", background: "var(--border)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>NPWP</span>
                      <span style={{ fontSize: "13px", color: "var(--ts)", fontFamily: "monospace" }}>{tx.vendorTaxId}</span>
                    </div>
                  </div>
                </div>

                {/* Detail rows */}
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

                {/* Status */}
                <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "var(--tm)" }}>Status saat ini:</span>
                  <span style={{ padding: "4px 14px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "12px", fontWeight: 500 }}>{sc.label}</span>
                </div>
              </div>
            </div>

            {canAct && <ModalActions />}
          </div>
        </div>
      )}
    </>
  );
}

function DesktopHeader({ tx, sc, onClose }: { tx: ProcurementTransaction; sc: any; onClose: () => void }) {
  return (
    <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "16px", background: "var(--surface-2)", flexShrink: 0 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--em)" }}>{tx.id}</span>
          <span style={{ fontSize: "11px", color: "var(--tm)", fontFamily: "monospace" }}>{tx.docNumber}</span>
          <span style={{ fontSize: "11px", color: "var(--tm)" }}>·</span>
          <span style={{ fontSize: "12px", color: "var(--tm)" }}>{tx.date}</span>
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
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--em)" }}>{tx.id}</span>
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

function MobileBody({ tx, scoreColor, scoreBg, scoreBorder, scoreLabel, detailRows, sc }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "16px", borderRadius: "12px", background: scoreBg, border: `1px solid ${scoreBorder}` }}>
        <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>Fraud Score</div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "40px", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{tx.fraudScore}</span>
          <div style={{ flex: 1 }}>
            <div style={{ height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{ width: `${tx.fraudScore}%`, height: "100%", background: scoreColor, borderRadius: "3px" }} />
            </div>
            <div style={{ fontSize: "11px", color: scoreColor, fontWeight: 500 }}>{scoreLabel}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Analisis AI</span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.65, fontWeight: 300 }}>{tx.aiExplanation}</p>
      </div>

      {tx.flags.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Fraud Flags</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {tx.flags.map((f: string) => <span key={f} style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>)}
          </div>
        </div>
      )}

      {/* Vendor info */}
      <div>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Info Vendor</div>
        <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>Nama Vendor</span>
            <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{tx.vendorName}</span>
          </div>
          <div style={{ height: "1px", background: "var(--border)" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>NPWP</span>
            <span style={{ fontSize: "13px", color: "var(--ts)", fontFamily: "monospace" }}>{tx.vendorTaxId}</span>
          </div>
        </div>
      </div>

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

function ModalActions({ isMobile }: { isMobile?: boolean }) {
  return (
    <div style={{ padding: isMobile ? "16px" : "20px 28px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px", background: "var(--surface-2)", flexShrink: 0 }}>
      <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>Tindakan Auditor</div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={{ flex: 1, padding: isMobile ? "10px" : "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>✓ Approve</button>
        <button style={{ flex: 1, padding: isMobile ? "10px" : "11px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.30)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✕ Reject</button>
        <button style={{ padding: isMobile ? "10px 14px" : "11px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--ts)", fontSize: "13px", fontWeight: 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>↑ Eskalasi</button>
      </div>
    </div>
  );
}