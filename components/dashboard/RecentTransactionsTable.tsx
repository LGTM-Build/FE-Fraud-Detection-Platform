"use client";

import { useState, useEffect } from "react";
import ScoreBadge from "@/components/ui/ScoreBadge";
import TransactionDetailDrawer from "./TransactionDetailDrawer";
import styles from "@/app/(auth)/register/register.module.css";

const tableHeaders = ["ID", "Tanggal", "Deskripsi", "Modul", "Jumlah", "Fraud Score", "Status", ""];

const APP_STATUS_CONFIG: Record<string, any> = {
  pending: { label: "Diproses AI", bg: "var(--surface-2)", color: "var(--ts)", border: "var(--border)", dot: "var(--tm)" },
  alert: { label: "Perlu Review", bg: "rgba(245,158,11,0.08)", color: "#d97706", border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  high_alert: { label: "High Alert", bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#dc2626" },
  auto_approved: { label: "Auto-Approved", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  approved: { label: "Approved", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#dc2626" },
};

const MODULE_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "expense", label: "Expense" },
  { value: "procurement", label: "Procurement" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "alert", label: "Perlu Review" },
  { value: "high_alert", label: "High Alert" },
  { value: "auto_approved", label: "Auto-Approved" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "pending", label: "Diproses AI" },
];

function useDevice() {
  const [state, setState] = useState({ isMobile: false, isTablet: false });

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setState({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
      });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return state;
}

export default function RecentTransactionsTable({ data }: { data: any[] }) {
  const { isMobile, isTablet } = useDevice();

  const [filterModule, setFilterModule] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [moduleOpen, setModuleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDetail = (tx: any) => {
    setSelectedTx(tx);
    setIsDrawerOpen(true);
  };

  const filtered = data.filter(t => {
    const txModule = (t.module || t.type || "").toLowerCase();

    if (filterModule === "expense" && !txModule.includes("expense") && !txModule.includes("pengeluaran")) return false;
    if (filterModule === "procurement" && !txModule.includes("procurement") && !txModule.includes("pengadaan")) return false;

    const txStatus = (t.status || "pending").toLowerCase();
    if (filterStatus !== "all" && !txStatus.includes(filterStatus)) return false;

    return true;
  });

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>

      {/* HEADER */}
      <div style={{
        padding: isMobile ? "16px" : "20px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        gap: "12px"
      }}>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>
            Transaksi Terbaru
          </h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>
            {filtered.length} transaksi ditampilkan
          </p>
        </div>

        {/* FILTER */}
        {(isMobile || isTablet) ? (
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>

            {/* MODULE */}
            <div style={{ flex: 1 }}>
              <div className={styles.customSelectWrapper}>
                <div
                  className={`${styles.customSelectTrigger} ${moduleOpen ? styles.open : ""}`}
                  onClick={() => setModuleOpen(!moduleOpen)}
                  onBlur={() => setTimeout(() => setModuleOpen(false), 150)}
                  tabIndex={0}
                >
                  <span>{MODULE_OPTIONS.find(o => o.value === filterModule)?.label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>

                {moduleOpen && (
                  <div className={styles.customSelectDropdown}>
                    {MODULE_OPTIONS.map(opt => (
                      <div
                        key={opt.value}
                        className={`${styles.customSelectOption} ${filterModule === opt.value ? styles.selected : ""}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFilterModule(opt.value);
                          setModuleOpen(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div style={{ flex: 1 }}>
              <div className={styles.customSelectWrapper}>
                <div
                  className={`${styles.customSelectTrigger} ${statusOpen ? styles.open : ""}`}
                  onClick={() => setStatusOpen(!statusOpen)}
                  onBlur={() => setTimeout(() => setStatusOpen(false), 150)}
                  tabIndex={0}
                >
                  <span>{STATUS_OPTIONS.find(o => o.value === filterStatus)?.label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>

                {statusOpen && (
                  <div className={styles.customSelectDropdown}>
                    {STATUS_OPTIONS.map(opt => (
                      <div
                        key={opt.value}
                        className={`${styles.customSelectOption} ${filterStatus === opt.value ? styles.selected : ""}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFilterStatus(opt.value);
                          setStatusOpen(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ display: "flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "3px", gap: "2px" }}>
              {MODULE_OPTIONS.map(f => (
                <button key={f.value}
                  onClick={() => setFilterModule(f.value)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: filterModule === f.value ? 500 : 400,
                    background: filterModule === f.value ? "var(--em-subtle-2)" : "transparent",
                    color: filterModule === f.value ? "var(--em)" : "var(--tm)"
                  }}>
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "3px", gap: "2px" }}>
              {STATUS_OPTIONS.map(f => (
                <button key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: filterStatus === f.value ? 500 : 400,
                    background: filterStatus === f.value ? "var(--em-subtle-2)" : "transparent",
                    color: filterStatus === f.value ? "var(--em)" : "var(--tm)"
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      {(isMobile || isTablet) ? (
        <div style={{ padding: "12px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--tm)", fontSize: "13px" }}>
              Belum ada transaksi yang sesuai.
            </div>
          ) : filtered.map((t, i) => {

            const sc = APP_STATUS_CONFIG[(t.status || "pending").toLowerCase()] || APP_STATUS_CONFIG.pending;

            const isProc = (t.module || t.type || "").toLowerCase().includes("procurement") || (t.module || t.type || "").toLowerCase().includes("pengadaan");
            const mc = isProc
              ? { label: "Procurement", bg: "rgba(99,102,241,0.08)", color: "#6366f1", border: "rgba(99,102,241,0.20)" }
              : { label: "Expense", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)" };

            const formattedAmount = t.amountTotal
              ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(t.amountTotal))
              : "Rp 0";

            return (
              <div
                key={t.id || i}
                onClick={() => openDetail(t)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "12px",
                  marginBottom: "10px",
                  background: "var(--card-bg)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--em)" }}>
                    {t.code || (t.id ? t.id.slice(0, 8) : "—")}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--tm)" }}>
                    {t.date ? new Date(t.date).toLocaleDateString("id-ID") : "—"}
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: "var(--tp)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.description}
                </div>

                <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px" }}>
                  {t.subDescription ?? "—"}
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "100px", background: mc.bg, color: mc.color, border: `1px solid ${mc.border}`, fontSize: "11px" }}>
                    {mc.label}
                  </span>

                  <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px" }}>
                    {sc.label}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--tp)" }}>
                    {formattedAmount}
                  </span>

                  <ScoreBadge score={t.fraudScore} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {tableHeaders.map((h, idx) => (
                  <th key={idx} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap", background: "var(--surface-2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "30px", textAlign: "center", color: "var(--tm)", fontSize: "13px" }}>Belum ada transaksi yang sesuai.</td></tr>
              ) : filtered.map((t, i) => {
                const txStatus = (t.status || "pending").toLowerCase();
                const sc = APP_STATUS_CONFIG[txStatus] || APP_STATUS_CONFIG.pending;
                
                const isProc = (t.module || t.type || "").toLowerCase().includes("procurement") || (t.module || t.type || "").toLowerCase().includes("pengadaan");
                const mc = isProc ? { label: "Procurement", bg: "rgba(99,102,241,0.08)", color: "#6366f1", border: "rgba(99,102,241,0.20)" } : { label: "Expense", bg: "rgba(16,185,129,0.08)", color: "var(--em)", border: "rgba(16,185,129,0.20)" };
                const isLast = i === filtered.length - 1;

                const formattedAmount = t.amountTotal ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(t.amountTotal)) : "Rp 0";

                return (
                  <tr
                    key={t.id || i}
                    onClick={() => openDetail(t)}
                    style={{ borderBottom: isLast ? "none" : "1px solid var(--border)", transition: "background 0.15s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)", fontFamily: "'DM Sans', monospace" }}>{t.code || (t.id ? t.id.slice(0, 8) : "—")}</span>
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{t.date ? new Date(t.date).toLocaleDateString("id-ID") : "—"}</span>
                    </td>
                    <td style={{ padding: "14px 16px", minWidth: "200px", maxWidth: "260px" }}>
                      <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
                      <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{t.subDescription ?? "—"}</div>
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", background: mc.bg, color: mc.color, border: `1px solid ${mc.border}`, fontSize: "11px", fontWeight: 500 }}>{mc.label}</span>
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{formattedAmount}</span>
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <ScoreBadge score={t.fraudScore} />
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                        <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>{sc.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap", textAlign: "right" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s" }}><polyline points="9 18 15 12 9 6" /></svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>
      )}

      <TransactionDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        tx={selectedTx}
        isMobile={isMobile}
      />
    </div>
  );
}