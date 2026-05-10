import { useState } from "react";
import { getFraudRiskConfig } from "@/data/expenses"; // Sesuaikan jika ada perubahan path di datamu

// Map status sesuai BE (Alert dan High Alert)
const APP_STATUS_CONFIG: Record<string, any> = {
  pending: { label: "Diproses AI", bg: "var(--surface-2)", color: "var(--ts)", border: "var(--border)", dot: "var(--tm)" },
  alert: { label: "Perlu Review", bg: "rgba(245,158,11,0.08)", color: "#d97706", border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  high_alert: { label: "High Alert", bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#dc2626" },
  auto_approved: { label: "Auto-Approved", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  approved: { label: "Approved", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#dc2626" },
};

interface DetailModalProps {
  tx: any; // Pakai any sementara agar luwes dengan response backend
  onClose: () => void;
  isMobile?: boolean;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
}

export function DetailModal({ tx, onClose, isMobile, onApprove, onReject }: DetailModalProps) {
  if (!tx) return null;

  const txStatus = (tx.status || "pending").toLowerCase();
  const sc = APP_STATUS_CONFIG[txStatus] || APP_STATUS_CONFIG.pending;
  const risk = getFraudRiskConfig(tx.fraudScore);
  const canAct = txStatus === "alert" || txStatus === "high_alert";

  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);

  const handleAction = async (type: "approve" | "reject") => {
    const fn = type === "approve" ? onApprove : onReject;
    if (!fn) return;
    
    setActionLoading(type);
    try { 
      await fn(tx.id); 
      onClose(); 
    } catch (e) {
      console.error("Action error:", e);
      alert("Aksi gagal dilakukan.");
    } finally { 
      setActionLoading(null); 
    }
  };

  const fmtAmount = tx.amountTotal 
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(tx.amountTotal)) 
    : "Rp 0";
    
  const fmtDate = tx.expenseDate ? new Date(tx.expenseDate).toLocaleDateString("id-ID") : "—";
  
  // Mengatasi data flags dari backend
  let safeFlags: string[] = [];
  if (Array.isArray(tx.flags)) safeFlags = tx.flags;
  else if (typeof tx.flags === "string" && tx.flags.length > 0) safeFlags = tx.flags.split(",").map((s: string) => s.trim());

  const detailRows = [
    { label: "Kategori",    value: tx.detail?.categoryLabel || tx.category || "—" },
    { label: "Merchant",    value: tx.merchant ?? "—" },
    { label: "Karyawan",    value: tx.employeeName ?? tx.detail?.fullName ?? "—" },
    { label: "Departemen",  value: tx.department ?? tx.detail?.department ?? "—" },
    { label: "Tanggal",     value: fmtDate },
    { label: "Total",       value: fmtAmount, highlight: true },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease" }} />
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInBottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>

      <div style={{ position: "fixed", zIndex: 201, display: "flex", flexDirection: "column", ...(isMobile ? { left: 0, right: 0, bottom: 0, background: "var(--bg)", borderRadius: "20px 20px 0 0", maxHeight: "90vh", animation: "slideInBottom 0.28s cubic-bezier(0.32,0.72,0,1)" } : { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", maxWidth: "860px", maxHeight: "calc(100vh - 48px)", background: "var(--bg)", borderRadius: "20px", animation: "slideUp 0.24s cubic-bezier(0.22,1,0.36,1)" }), boxShadow: isMobile ? "0 -16px 48px rgba(0,0,0,0.2)" : "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "16px", background: "var(--surface-2)", flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--em)" }}>{tx.expenseId ?? tx.code ?? tx.id.slice(0, 8)}</span>
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", margin: 0, letterSpacing: "-0.4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {tx.description}
            </h3>
          </div>
          <button onClick={onClose} style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0, transition: "all 0.15s" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Content Body Grid */}
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
          {/* Kiri: AI & Score */}
          <div style={{ padding: "24px", borderRight: isMobile ? "none" : "1px solid var(--border)", borderBottom: isMobile ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", gap: "20px" }}>
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
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#6366f1" }}>Sedang Dianalisis AI...</div>
              )}
            </div>

            <div style={{ padding: "16px 18px", borderRadius: "14px", background: "var(--surface-2)", border: "1px solid var(--border)", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Analisis AI</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                {tx.aiExplanation ?? "Analisis AI belum tersedia."}
              </p>
            </div>

            {safeFlags.length > 0 && (
              <div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Temuan AI</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {safeFlags.map(f => (
                    <span key={f} style={{ padding: "5px 14px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kanan: Detail Transaksi */}
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "12px" }}>Detail Pengeluaran</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {detailRows.map((row, i) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < detailRows.length - 1 ? "1px solid var(--border)" : "none", gap: "16px" }}>
                    <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: row.highlight ? "15px" : "13px", fontWeight: row.highlight ? 700 : 400, color: row.highlight ? "var(--tp)" : "var(--ts)", textAlign: "right" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px", marginTop: "auto" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "var(--tm)" }}>Status saat ini:</span>
              <span style={{ padding: "4px 14px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "12px", fontWeight: 500 }}>{sc.label}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {canAct && (
          <div style={{ padding: "20px 28px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px", background: "var(--surface-2)", flexShrink: 0 }}>
             <div style={{ fontSize: "11px", color: "var(--tm)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>Tindakan Auditor</div>
             <div style={{ display: "flex", gap: "8px" }}>
               <button onClick={() => handleAction("approve")} disabled={actionLoading !== null} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: actionLoading ? "var(--surface-2)" : "linear-gradient(135deg, var(--em), var(--em2))", color: actionLoading ? "var(--tm)" : "#fff", fontSize: "13px", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                 {actionLoading === "approve" ? "Memproses..." : "✓ Setujui"}
               </button>
               <button onClick={() => handleAction("reject")} disabled={actionLoading !== null} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.30)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "13px", fontWeight: 600, cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                 {actionLoading === "reject" ? "Memproses..." : "✕ Tolak"}
               </button>
             </div>
          </div>
        )}
      </div>
    </>
  );
}