"use client";
import { useState } from "react";

type Status = "auto-approved" | "pending" | "high-alert" | "approved" | "rejected";

interface ProcurementTransaction {
  id: string;
  docNumber: string;
  date: string;
  vendorName: string;
  vendorTaxId: string;
  itemDescription: string;
  businessUnit: string;
  requester: string;
  approver: string;
  amount: number;
  fraudScore: number;
  flags: string[];
  status: Status;
  procurementMethod: string;
  aiExplanation: string;
}

const mockData: ProcurementTransaction[] = [
  {
    id: "PRC-0036", docNumber: "PO-2026-0892", date: "10 Apr 2026",
    vendorName: "UD Stationery Plus", vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q2",
    businessUnit: "General Affairs", requester: "Hendra Wijaya", approver: "Hendra Wijaya",
    amount: 3750000, fraudScore: 91,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Invoice ini identik dengan PRC-0021 tertanggal 28 Mar 2026 (nominal dan vendor sama). Ditemukan juga bahwa requester dan approver adalah orang yang sama — pelanggaran Segregation of Duties.",
  },
  {
    id: "PRC-0040", docNumber: "PO-2026-0901", date: "12 Apr 2026",
    vendorName: "CV Maju Bersama", vendorTaxId: "07.891.234.5-678.000",
    itemDescription: "Pengadaan ATK & perlengkapan kantor",
    businessUnit: "Procurement", requester: "Dewi Rahayu", approver: "Suharto Wibowo",
    amount: 18500000, fraudScore: 74,
    flags: ["Price Markup", "Vendor Baru"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Vendor baru terdaftar 14 hari sebelum PO dibuat. Harga satuan 280% di atas harga e-Katalog LKPP untuk item serupa. Tidak ada riwayat transaksi sebelumnya.",
  },
  {
    id: "PRC-0038", docNumber: "PO-2026-0887", date: "11 Apr 2026",
    vendorName: "PT Solusi Digital Indonesia", vendorTaxId: "03.456.789.0-123.000",
    itemDescription: "Jasa konsultasi pengembangan sistem IT",
    businessUnit: "IT", requester: "Rina Kusuma", approver: "Rina Kusuma",
    amount: 75000000, fraudScore: 61,
    flags: ["Self Approval", "Bypass Tender"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Nilai kontrak Rp 75.000.000 seharusnya melalui tender terbuka berdasarkan kebijakan internal (threshold Rp 50.000.000). Ditemukan juga self-approval pada dokumen ini.",
  },
  {
    id: "PRC-0029", docNumber: "PO-2026-0841", date: "5 Apr 2026",
    vendorName: "PT Cepat Untung Mandiri", vendorTaxId: "09.012.345.6-789.000",
    itemDescription: "Jasa cleaning service gedung kantor",
    businessUnit: "General Affairs", requester: "Anton Susilo", approver: "Budi Laksono",
    amount: 55000000, fraudScore: 88,
    flags: ["Shell Company", "Vendor Baru", "Price Markup"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Vendor terdaftar 3 hari sebelum PO. Alamat vendor tidak dapat diverifikasi. Tidak ditemukan NPWP aktif di database DJP. Harga 340% di atas benchmark pasar.",
  },
  {
    id: "PRC-0033", docNumber: "PO-2026-0862", date: "8 Apr 2026",
    vendorName: "PT Mitra Teknologi Nusantara", vendorTaxId: "02.345.678.9-012.000",
    itemDescription: "Lisensi software ERP tahunan",
    businessUnit: "IT", requester: "Fajar Nugroho", approver: "Hendri Saputra",
    amount: 120000000, fraudScore: 22,
    flags: [],
    status: "auto-approved",
    procurementMethod: "Tender Terbuka",
    aiExplanation: "Tidak ditemukan anomali. Vendor terverifikasi, proses tender sesuai prosedur, harga kompetitif sesuai penawaran.",
  },
  {
    id: "PRC-0027", docNumber: "PO-2026-0829", date: "3 Apr 2026",
    vendorName: "CV Berkah Jaya Abadi", vendorTaxId: "05.678.901.2-345.000",
    itemDescription: "Catering rapat direksi Q2",
    businessUnit: "Secretary", requester: "Lina Marlina", approver: "Wawan Setiawan",
    amount: 8200000, fraudScore: 38,
    flags: ["Inflated Amount"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Biaya katering Rp 8.200.000 untuk 25 orang setara Rp 328.000/orang — 60% di atas rata-rata historis untuk kategori yang sama.",
  },
  {
    id: "PRC-0021", docNumber: "PO-2026-0798", date: "28 Mar 2026",
    vendorName: "UD Stationery Plus", vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q1",
    businessUnit: "General Affairs", requester: "Hendra Wijaya", approver: "Hendra Wijaya",
    amount: 3750000, fraudScore: 85,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "rejected",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Duplikasi dari PRC-0036. Invoice dan nominal identik. Ditolak oleh auditor senior.",
  },
  {
    id: "PRC-0018", docNumber: "PO-2026-0771", date: "25 Mar 2026",
    vendorName: "PT Infrastruktur Andalan", vendorTaxId: "04.567.890.1-234.000",
    itemDescription: "Perbaikan AC gedung lantai 3-5",
    businessUnit: "Building Management", requester: "Sigit Purnomo", approver: "Darmawan",
    amount: 42000000, fraudScore: 15,
    flags: [],
    status: "approved",
    procurementMethod: "Seleksi Langsung",
    aiExplanation: "Transaksi normal. Vendor terpercaya dengan riwayat 12 transaksi sebelumnya. Harga sesuai kontrak payung.",
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

function fmt(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

// ─── Detail Drawer ───────────────────────────────────────────
function DetailDrawer({ tx, onClose }: { tx: ProcurementTransaction; onClose: () => void }) {
  const sc = statusConfig[tx.status];
  const scoreColor = tx.fraudScore >= 70 ? "#ef4444" : tx.fraudScore >= 30 ? "#f59e0b" : "#10b981";
  const scoreBg = tx.fraudScore >= 70 ? "rgba(239,68,68,0.08)" : tx.fraudScore >= 30 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)";
  const scoreBorder = tx.fraudScore >= 70 ? "rgba(239,68,68,0.20)" : tx.fraudScore >= 30 ? "rgba(245,158,11,0.20)" : "rgba(16,185,129,0.20)";

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: "440px", background: "var(--bg)",
        borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--em)", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "2px" }}>{tx.id} · {tx.docNumber}</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px" }}>
              Detail Pengadaan
            </h3>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Score */}
          <div style={{ padding: "16px 20px", borderRadius: "12px", background: scoreBg, border: `1px solid ${scoreBorder}` }}>
            <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>Fraud Score</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "36px", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{tx.fraudScore}</span>
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
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Analisis AI</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.65, fontWeight: 300 }}>{tx.aiExplanation}</p>
          </div>

          {/* Flags */}
          {tx.flags.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Fraud Flags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {tx.flags.map(f => (
                  <span key={f} style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                ))}
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

          {/* Transaction details */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Detail Transaksi</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Item", value: tx.itemDescription },
                { label: "Unit Bisnis", value: tx.businessUnit },
                { label: "Requester", value: tx.requester },
                { label: "Approver", value: tx.approver },
                { label: "Metode", value: tx.procurementMethod },
                { label: "Tanggal", value: tx.date },
                { label: "Total", value: fmt(tx.amount), highlight: true },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  gap: "16px",
                }}>
                  <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: row.highlight ? 600 : 400, color: row.highlight ? "var(--tp)" : "var(--ts)", textAlign: "right" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>Status:</span>
            <span style={{ padding: "4px 12px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "12px", fontWeight: 500 }}>
              {sc.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        {(tx.status === "pending" || tx.status === "high-alert") && (
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "4px" }}>Tindakan Auditor</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                ✓ Approve
              </button>
              <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.30)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ✕ Reject
              </button>
              <button style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "13px", fontWeight: 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                ↑ Eskalasi
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────
type FilterStatus = "all" | Status;

export default function ProcurementMonitorPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterBU, setFilterBU] = useState("all");
  const [selectedTx, setSelectedTx] = useState<ProcurementTransaction | null>(null);

  const businessUnits = ["all", ...Array.from(new Set(mockData.map(t => t.businessUnit)))];

  const filtered = mockData.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterBU !== "all" && t.businessUnit !== filterBU) return false;
    return true;
  });

  const counts = {
    all: mockData.length,
    "high-alert": mockData.filter(t => t.status === "high-alert").length,
    pending: mockData.filter(t => t.status === "pending").length,
    "auto-approved": mockData.filter(t => t.status === "auto-approved").length,
    approved: mockData.filter(t => t.status === "approved").length,
    rejected: mockData.filter(t => t.status === "rejected").length,
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
              Procurement Monitor
            </h1>
            <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
              Monitor dan review transaksi pengadaan vendor
            </p>
          </div>
          <a href="/dashboard/import" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, textDecoration: "none", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import CSV
          </a>
        </div>

        {/* Status tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "6px" }}>
          {(["all", "high-alert", "pending", "auto-approved", "approved", "rejected"] as FilterStatus[]).map(s => {
            const labels: Record<FilterStatus, string> = { all: "Semua", "high-alert": "High Alert", pending: "Pending", "auto-approved": "Auto Approved", approved: "Approved", rejected: "Rejected" };
            const isActive = filterStatus === s;
            const isAlert = s === "high-alert";
            return (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px", borderRadius: "10px", border: "none",
                fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 500 : 400, transition: "all 0.15s",
                background: isActive ? (isAlert ? "rgba(239,68,68,0.12)" : "var(--em-subtle-2)") : "transparent",
                color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)",
              }}>
                {labels[s]}
                <span style={{ fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "100px", background: isActive ? (isAlert ? "rgba(239,68,68,0.15)" : "var(--em-subtle-2)") : "var(--surface-2)", color: isActive ? (isAlert ? "#dc2626" : "var(--em)") : "var(--tm)" }}>
                  {counts[s as keyof typeof counts] ?? 0}
                </span>
              </button>
            );
          })}

          {/* BU filter */}
          <div style={{ marginLeft: "auto" }}>
            <select value={filterBU} onChange={e => setFilterBU(e.target.value)} style={{ padding: "7px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
              <option value="all">Semua Unit Bisnis</option>
              {businessUnits.filter(d => d !== "all").map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["ID / No. PO", "Tanggal", "Vendor", "Item", "Unit Bisnis", "Metode", "Total", "Score", "Flag", "Status", ""].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap", background: "var(--surface-2)" }}>
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
                    <tr key={t.id} onClick={() => setSelectedTx(t)}
                      style={{ borderBottom: isLast ? "none" : "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{t.id}</div>
                        <div style={{ fontSize: "11px", color: "var(--tm)", fontFamily: "monospace" }}>{t.docNumber}</div>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "12px", color: "var(--tm)" }}>{t.date}</span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap", maxWidth: "160px" }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis" }}>{t.vendorName}</div>
                        <div style={{ fontSize: "10px", color: "var(--tm)", fontFamily: "monospace" }}>{t.vendorTaxId}</div>
                      </td>
                      <td style={{ padding: "13px 16px", maxWidth: "200px" }}>
                        <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.itemDescription}</div>
                        <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{t.requester} → {t.approver}</div>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "12px", color: "var(--ts)" }}>{t.businessUnit}</span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>
                          {t.procurementMethod}
                        </span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{fmt(t.amount)}</span>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <ScoreBar score={t.fraudScore} />
                      </td>
                      <td style={{ padding: "13px 16px", minWidth: "160px" }}>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {t.flags.length === 0
                            ? <span style={{ fontSize: "11px", color: "var(--tm)" }}>—</span>
                            : t.flags.map(f => (
                              <span key={f} style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", fontSize: "10px", color: "#dc2626", fontWeight: 500, whiteSpace: "nowrap" }}>{f}</span>
                            ))
                          }
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                          <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{sc.label}</span>
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
          <div style={{ padding: "13px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>{filtered.length} dari {mockData.length} transaksi ditampilkan</span>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>Klik baris untuk detail & review</span>
          </div>
        </div>
      </div>

      {selectedTx && <DetailDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </>
  );
}