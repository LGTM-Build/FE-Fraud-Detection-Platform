"use client";
import { useState } from "react";

type Status = "auto-approved" | "pending" | "high-alert" | "approved" | "rejected";

interface ExpenseTransaction {
  id: string;
  date: string;
  category: string;
  description: string;
  merchant: string;
  employee: string;
  department: string;
  grade: string;
  amount: number;
  fraudScore: number;
  flags: string[];
  status: Status;
  aiExplanation: string;
}

const mockExpenses: ExpenseTransaction[] = [
  {
    id: "EXP-0041", date: "12 Apr 2026", category: "Entertainment",
    description: "Dinner client - Sate Khas Senayan",
    merchant: "Sate Khas Senayan SCBD", employee: "Budi Santoso",
    department: "Sales", grade: "Manager",
    amount: 4200000, fraudScore: 82,
    flags: ["Inflated Amount", "Entertainment Abuse"],
    status: "high-alert",
    aiExplanation: "Nominal Rp 4.200.000 melebihi batas entertainment Manager (Rp 2.000.000). Pola pengeluaran serupa terdeteksi 3x dalam 30 hari terakhir dari karyawan yang sama.",
  },
  {
    id: "EXP-0039", date: "11 Apr 2026", category: "Transport",
    description: "Transport dinas Surabaya",
    merchant: "Grab Business", employee: "Ahmad Fauzi",
    department: "Operations", grade: "Staff",
    amount: 850000, fraudScore: 45,
    flags: ["Weekend Claim"],
    status: "pending",
    aiExplanation: "Klaim dilakukan pada hari Sabtu (hari libur). Tidak ada perjalanan dinas terdaftar pada tanggal tersebut.",
  },
  {
    id: "EXP-0037", date: "11 Apr 2026", category: "Office Supply",
    description: "Pembelian alat tulis kantor",
    merchant: "Gramedia", employee: "Siti Nurhaliza",
    department: "Finance", grade: "Staff",
    amount: 2100000, fraudScore: 18,
    flags: [],
    status: "auto-approved",
    aiExplanation: "Tidak ditemukan anomali. Nominal sesuai kebijakan, merchant terverifikasi, hari kerja normal.",
  },
  {
    id: "EXP-0035", date: "10 Apr 2026", category: "Meals",
    description: "Makan siang tim - 3 hari",
    merchant: "GoPay Food", employee: "Maya Indah",
    department: "Engineering", grade: "Staff",
    amount: 620000, fraudScore: 22,
    flags: [],
    status: "auto-approved",
    aiExplanation: "Klaim wajar. Nominal per hari sesuai batas kebijakan untuk kategori meals.",
  },
  {
    id: "EXP-0034", date: "10 Apr 2026", category: "Vehicle",
    description: "Servis kendaraan operasional",
    merchant: "Astra Daihatsu Service", employee: "Doni Prasetyo",
    department: "Operations", grade: "Supervisor",
    amount: 5800000, fraudScore: 55,
    flags: ["Inflated Amount"],
    status: "pending",
    aiExplanation: "Biaya servis Rp 5.800.000 berada di atas rata-rata untuk jenis kendaraan yang sama (rata-rata Rp 2.800.000). Disarankan verifikasi invoice asli dari bengkel.",
  },
  {
    id: "EXP-0031", date: "9 Apr 2026", category: "Entertainment",
    description: "Client meeting - Hotel Mulia",
    merchant: "Hotel Mulia Senayan", employee: "Rudi Hermawan",
    department: "Sales", grade: "Director",
    amount: 12500000, fraudScore: 67,
    flags: ["Missing Receipt", "Inflated Amount"],
    status: "pending",
    aiExplanation: "Struk tidak dilampirkan dalam pengajuan. Nominal di atas rata-rata entertainment Director, meskipun masih dalam batas policy.",
  },
  {
    id: "EXP-0028", date: "8 Apr 2026", category: "Training",
    description: "Online course subscription",
    merchant: "Udemy Business", employee: "Laila Sari",
    department: "HR", grade: "Staff",
    amount: 450000, fraudScore: 12,
    flags: [],
    status: "approved",
    aiExplanation: "Klaim disetujui. Nominal kecil, merchant terpercaya, sesuai program training perusahaan.",
  },
  {
    id: "EXP-0025", date: "7 Apr 2026", category: "Transport",
    description: "Tiket pesawat Jakarta-Bali",
    merchant: "Traveloka Business", employee: "Hendra Gunawan",
    department: "Marketing", grade: "Manager",
    amount: 3200000, fraudScore: 71,
    flags: ["Duplicate Claim", "Split Transaction"],
    status: "high-alert",
    aiExplanation: "Terdeteksi klaim tiket perjalanan yang sama dengan EXP-0019 tertanggal 2 Apr. Diduga split transaction untuk menghindari batas approval.",
  },
  {
    id: "EXP-0019", date: "2 Apr 2026", category: "Transport",
    description: "Tiket pesawat Jakarta-Bali (2)",
    merchant: "Tiket.com", employee: "Hendra Gunawan",
    department: "Marketing", grade: "Manager",
    amount: 3100000, fraudScore: 78,
    flags: ["Duplicate Claim"],
    status: "rejected",
    aiExplanation: "Klaim ini merupakan duplikasi dari perjalanan yang sama dengan EXP-0025. Sudah ditolak oleh auditor.",
  },
];

const statusConfig: Record<Status, { label: string; bg: string; color: string; border: string; dot: string }> = {
  "auto-approved": { label: "Auto Approved", bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  "pending":       { label: "Pending Review", bg: "rgba(245,158,11,0.10)", color: "#d97706", border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  "high-alert":    { label: "High Alert", bg: "rgba(239,68,68,0.10)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#ef4444" },
  "approved":      { label: "Approved", bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  "rejected":      { label: "Rejected", bg: "rgba(100,100,100,0.10)", color: "var(--tm)", border: "var(--border)", dot: "var(--tm)" },
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "#ef4444" : score >= 30 ? "#f59e0b" : "#10b981";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: "48px", height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "2px" }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 600, color, minWidth: "24px" }}>{score}</span>
    </div>
  );
}

function fmt(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// ─── Detail Drawer ──────────────────────────────────────────
function DetailDrawer({ tx, onClose }: { tx: ExpenseTransaction; onClose: () => void }) {
  const sc = statusConfig[tx.status];
  const scoreColor = tx.fraudScore >= 70 ? "#ef4444" : tx.fraudScore >= 30 ? "#f59e0b" : "#10b981";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: "420px",
        background: "var(--bg)",
        borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
      }}>

        {/* Drawer header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--em)", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "3px" }}>
              {tx.id}
            </div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "16px",
              fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px",
            }}>
              Detail Klaim
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              border: "1px solid var(--border)", background: "var(--surface-2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--ts)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Drawer body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Fraud score */}
          <div style={{
            padding: "16px 20px", borderRadius: "12px",
            background: tx.fraudScore >= 70 ? "rgba(239,68,68,0.08)" : tx.fraudScore >= 30 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
            border: `1px solid ${tx.fraudScore >= 70 ? "rgba(239,68,68,0.20)" : tx.fraudScore >= 30 ? "rgba(245,158,11,0.20)" : "rgba(16,185,129,0.20)"}`,
          }}>
            <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>Fraud Score</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "36px", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                {tx.fraudScore}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden", marginBottom: "6px" }}>
                  <div style={{ width: `${tx.fraudScore}%`, height: "100%", background: scoreColor, borderRadius: "3px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "var(--tm)" }}>
                  {tx.fraudScore >= 70 ? "High Risk — perlu tindakan segera" : tx.fraudScore >= 30 ? "Medium Risk — perlu review" : "Low Risk — aman"}
                </div>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Analisis AI
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.65, fontWeight: 300 }}>
              {tx.aiExplanation}
            </p>
          </div>

          {/* Flags */}
          {tx.flags.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
                Fraud Flags
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {tx.flags.map(f => (
                  <span key={f} style={{
                    padding: "4px 12px", borderRadius: "100px",
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                    fontSize: "12px", color: "#dc2626", fontWeight: 500,
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Transaction details */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
              Detail Transaksi
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { label: "Deskripsi", value: tx.description },
                { label: "Kategori", value: tx.category },
                { label: "Merchant", value: tx.merchant },
                { label: "Karyawan", value: tx.employee },
                { label: "Departemen", value: tx.department },
                { label: "Jabatan", value: tx.grade },
                { label: "Tanggal", value: tx.date },
                { label: "Jumlah", value: fmt(tx.amount), highlight: true },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  gap: "16px",
                }}>
                  <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
                  <span style={{
                    fontSize: "13px", fontWeight: row.highlight ? 600 : 400,
                    color: row.highlight ? "var(--tp)" : "var(--ts)",
                    textAlign: "right",
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>Status:</span>
            <span style={{
              padding: "4px 12px", borderRadius: "100px",
              background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
              fontSize: "12px", fontWeight: 500,
            }}>
              {sc.label}
            </span>
          </div>
        </div>

        {/* Action buttons — only for pending/high-alert */}
        {(tx.status === "pending" || tx.status === "high-alert") && (
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: "8px",
          }}>
            <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "4px" }}>Tindakan Auditor</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{
                flex: 1, padding: "10px", borderRadius: "10px", border: "none",
                background: "linear-gradient(135deg, var(--em), var(--em2))",
                color: "#fff", fontSize: "13px", fontWeight: 500,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
              }}>
                ✓ Approve
              </button>
              <button style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                border: "1px solid rgba(239,68,68,0.30)",
                background: "rgba(239,68,68,0.06)",
                color: "#dc2626", fontSize: "13px", fontWeight: 500,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
                ✕ Reject
              </button>
              <button style={{
                padding: "10px 14px", borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
                color: "var(--ts)", fontSize: "13px", fontWeight: 400,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
                ↑ Eskalasi
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Page ──────────────────────────────────────────────
type FilterStatus = "all" | "pending" | "high-alert" | "approved" | "auto-approved" | "rejected";

export default function ExpenseMonitorPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDept, setFilterDept] = useState("all");
  const [selectedTx, setSelectedTx] = useState<ExpenseTransaction | null>(null);

  const departments = ["all", ...Array.from(new Set(mockExpenses.map(t => t.department)))];

  const filtered = mockExpenses.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterDept !== "all" && t.department !== filterDept) return false;
    return true;
  });

  const counts = {
    all: mockExpenses.length,
    "high-alert": mockExpenses.filter(t => t.status === "high-alert").length,
    pending: mockExpenses.filter(t => t.status === "pending").length,
    "auto-approved": mockExpenses.filter(t => t.status === "auto-approved").length,
    approved: mockExpenses.filter(t => t.status === "approved").length,
    rejected: mockExpenses.filter(t => t.status === "rejected").length,
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800,
              color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px",
            }}>
              Expense Monitor
            </h1>
            <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
              Monitor dan review klaim expense karyawan
            </p>
          </div>
          <a href="/dashboard/import" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "9px 16px", borderRadius: "10px",
            background: "linear-gradient(135deg, var(--em), var(--em2))",
            color: "#fff", fontSize: "13px", fontWeight: 500,
            textDecoration: "none", boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import CSV
          </a>
        </div>

        {/* Status filter tabs */}
        <div style={{
          display: "flex", gap: "6px", flexWrap: "wrap",
          background: "var(--card-bg)", border: "1px solid var(--card-b)",
          borderRadius: "14px", padding: "6px",
        }}>
          {(["all", "high-alert", "pending", "auto-approved", "approved", "rejected"] as FilterStatus[]).map(s => {
            const labels: Record<FilterStatus, string> = {
              all: "Semua", "high-alert": "High Alert", pending: "Pending Review",
              "auto-approved": "Auto Approved", approved: "Approved", rejected: "Rejected",
            };
            const isActive = filterStatus === s;
            const isAlert = s === "high-alert";
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "7px 14px", borderRadius: "10px", border: "none",
                  fontSize: "12px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: isActive ? 500 : 400,
                  transition: "all 0.15s",
                  background: isActive ? (isAlert ? "rgba(239,68,68,0.12)" : "var(--em-subtle-2)") : "transparent",
                  color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)",
                }}
              >
                {labels[s]}
                <span style={{
                  fontSize: "10px", fontWeight: 600,
                  padding: "1px 6px", borderRadius: "100px",
                  background: isActive
                    ? (isAlert ? "rgba(239,68,68,0.15)" : "var(--em-subtle-2)")
                    : "var(--surface-2)",
                  color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)",
                }}>
                  {counts[s]}
                </span>
              </button>
            );
          })}

          {/* Dept filter */}
          <div style={{ marginLeft: "auto" }}>
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              style={{
                padding: "7px 12px", borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--surface-2)", color: "var(--ts)",
                fontSize: "12px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
            >
              <option value="all">Semua Departemen</option>
              {departments.filter(d => d !== "all").map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--card-b)",
          borderRadius: "16px", overflow: "hidden",
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Tanggal", "Karyawan / Dept", "Deskripsi", "Kategori", "Jumlah", "Score", "Flag", "Status", ""].map(h => (
                    <th key={h} style={{
                      padding: "11px 16px", textAlign: "left",
                      fontSize: "11px", fontWeight: 600, color: "var(--tm)",
                      textTransform: "uppercase", letterSpacing: "0.8px",
                      whiteSpace: "nowrap", background: "var(--surface-2)",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const sc = statusConfig[t.status];
                  const isLast = i === filtered.length - 1;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTx(t)}
                      style={{
                        borderBottom: isLast ? "none" : "1px solid var(--border)",
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{t.id}</span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "12px", color: "var(--tm)" }}>{t.date}</span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{t.employee}</div>
                        <div style={{ fontSize: "11px", color: "var(--tm)" }}>{t.department} · {t.grade}</div>
                      </td>
                      <td style={{ padding: "13px 16px", maxWidth: "220px" }}>
                        <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {t.description}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{t.merchant}</div>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: "100px", fontSize: "11px",
                          background: "var(--em-subtle)", border: "1px solid var(--border)",
                          color: "var(--ts)",
                        }}>
                          {t.category}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>
                          {fmt(t.amount)}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <ScoreBar score={t.fraudScore} />
                      </td>
                      <td style={{ padding: "13px 16px", minWidth: "140px" }}>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {t.flags.length === 0
                            ? <span style={{ fontSize: "11px", color: "var(--tm)" }}>—</span>
                            : t.flags.map(f => (
                              <span key={f} style={{
                                padding: "2px 8px", borderRadius: "100px",
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                                fontSize: "10px", color: "#dc2626", fontWeight: 500, whiteSpace: "nowrap",
                              }}>
                                {f}
                              </span>
                            ))
                          }
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                          <span style={{
                            padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500,
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          }}>
                            {sc.label}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div style={{
            padding: "13px 20px", borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>
              {filtered.length} dari {mockExpenses.length} klaim ditampilkan
            </span>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>
              Klik baris untuk detail & review
            </span>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {selectedTx && (
        <DetailDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </>
  );
}