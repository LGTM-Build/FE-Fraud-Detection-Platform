// ─── Types ─────────────────────────────────────────────────────────────────────
export type ProcurementStatus =
  | "pending"
  | "high-alert"
  | "approved"
  | "rejected"
  | "auto-approved";

export type ViewTab = "review" | "history";
export type ReviewFilter = "all" | "high-alert" | "pending";
export type HistoryFilter = "all" | "approved" | "rejected" | "auto-approved";

export interface ProcurementTransaction {
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
  status: ProcurementStatus;
  procurementMethod: string;
  aiExplanation: string;
}

// ─── Constants & Logic Grouping ────────────────────────────────────────────────

export const REVIEW_STATUSES: ProcurementStatus[] = ["pending", "high-alert"];
export const HISTORY_STATUSES: ProcurementStatus[] = ["approved", "rejected", "auto-approved"];

export const TABLE_COL_HEADERS = [
  "ID / No. PO", "Tanggal", "Vendor", "Item",
  "Unit Bisnis", "Metode", "Total", "Score", "Flag", "Status", "",
];

export const VIEW_TABS_CONFIG = [
  { key: "review" as ViewTab, label: "Perlu Review" },
  { key: "history" as ViewTab, label: "History" },
];

export const REVIEW_FILTERS_CONFIG = [
  { key: "all" as ReviewFilter, label: "Semua" },
  { key: "high-alert" as ReviewFilter, label: "High Alert" },
  { key: "pending" as ReviewFilter, label: "Pending" },
];

export const HISTORY_FILTERS_CONFIG = [
  { key: "all" as HistoryFilter, label: "Semua" },
  { key: "approved" as HistoryFilter, label: "Approved" },
  { key: "auto-approved" as HistoryFilter, label: "Auto Approved" },
  { key: "rejected" as HistoryFilter, label: "Rejected" },
];

// ─── Status Visual Config ──────────────────────────────────────────────────────
export const statusConfig: Record<
  ProcurementStatus,
  { label: string; bg: string; color: string; border: string; dot: string }
> = {
  pending: {
    label: "Pending Review",
    bg: "rgba(245,158,11,0.10)",
    color: "#d97706",
    border: "rgba(245,158,11,0.20)",
    dot: "#f59e0b",
  },
  "high-alert": {
    label: "High Alert",
    bg: "rgba(239,68,68,0.10)",
    color: "#dc2626",
    border: "rgba(239,68,68,0.20)",
    dot: "#ef4444",
  },
  approved: {
    label: "Approved",
    bg: "rgba(16,185,129,0.10)",
    color: "#10b981",
    border: "rgba(16,185,129,0.20)",
    dot: "#10b981",
  },
  rejected: {
    label: "Rejected",
    bg: "rgba(100,100,100,0.10)",
    color: "var(--tm)",
    border: "var(--border)",
    dot: "var(--tm)",
  },
  "auto-approved": {
    label: "Auto Approved",
    bg: "rgba(16,185,129,0.08)",
    color: "#10b981",
    border: "rgba(16,185,129,0.15)",
    dot: "#10b981",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const getFraudRiskConfig = (score: number) => {
  if (score >= 70) return {
    label: "High Risk — perlu tindakan segera",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.18)"
  };
  if (score >= 30) return {
    label: "Medium Risk — perlu review",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.18)"
  };
  return {
    label: "Low Risk — aman",
    color: "#10b981",
    bg: "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.18)"
  };
};

export const fmtCompact = (n: number) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000)         return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
};

// ─── Mock data ─────────────────────────────────────────────────────────────────
// TODO integrasi: ganti dengan state dari fetch API
// GET /api/procurement-transactions?status=pending,high-alert  → reviewData
// GET /api/procurement-transactions?status=approved,rejected,auto-approved → historyData
export const MOCK_DATA: ProcurementTransaction[] = [
  {
    id: "PRC-0010",
    docNumber: "PO-2026-0892",
    date: "10 Apr 2026",
    vendorName: "UD Stationery Plus",
    vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q2",
    businessUnit: "General Affairs",
    requester: "Hendra Wijaya",
    approver: "Hendra Wijaya",
    amount: 3750000,
    fraudScore: 91,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation:
      "Invoice identik dengan PRC-0021. Requester dan approver orang yang sama — pelanggaran Segregation of Duties.",
  },
  {
    id: "PRC-0011",
    docNumber: "PO-2026-0901",
    date: "12 Apr 2026",
    vendorName: "CV Maju Bersama",
    vendorTaxId: "07.891.234.5-678.000",
    itemDescription: "Pengadaan ATK & perlengkapan kantor",
    businessUnit: "Procurement",
    requester: "Dewi Rahayu",
    approver: "Suharto Wibowo",
    amount: 18500000,
    fraudScore: 74,
    flags: ["Price Markup", "Vendor Baru"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Vendor baru terdaftar 14 hari sebelum PO. Harga 280% di atas e-Katalog LKPP.",
  },
  {
    id: "PRC-0012",
    docNumber: "PO-2026-0887",
    date: "11 Apr 2026",
    vendorName: "PT Solusi Digital Indonesia",
    vendorTaxId: "03.456.789.0-123.000",
    itemDescription: "Jasa konsultasi pengembangan sistem IT",
    businessUnit: "IT",
    requester: "Rina Kusuma",
    approver: "Rina Kusuma",
    amount: 75000000,
    fraudScore: 61,
    flags: ["Self Approval", "Bypass Tender"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation:
      "Nilai Rp 75.000.000 seharusnya lewat tender terbuka (threshold Rp 50jt). Ada self-approval.",
  },
  {
    id: "PRC-0013",
    docNumber: "PO-2026-0829",
    date: "3 Apr 2026",
    vendorName: "CV Berkah Jaya Abadi",
    vendorTaxId: "05.678.901.2-345.000",
    itemDescription: "Catering rapat direksi Q2",
    businessUnit: "Secretary",
    requester: "Lina Marlina",
    approver: "Wawan Setiawan",
    amount: 8200000,
    fraudScore: 38,
    flags: ["Inflated Amount"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Rp 328.000/orang — 60% di atas rata-rata historis kategori ini.",
  },
  {
    id: "PRC-0014",
    docNumber: "PO-2026-0862",
    date: "8 Apr 2026",
    vendorName: "PT Mitra Teknologi Nusantara",
    vendorTaxId: "02.345.678.9-012.000",
    itemDescription: "Lisensi software ERP tahunan",
    businessUnit: "IT",
    requester: "Fajar Nugroho",
    approver: "Hendri Saputra",
    amount: 120000000,
    fraudScore: 22,
    flags: [],
    status: "auto-approved",
    procurementMethod: "Tender Terbuka",
    aiExplanation: "Tidak ditemukan anomali. Vendor terverifikasi, tender sesuai prosedur.",
  },
  {
    id: "PRC-0015",
    docNumber: "PO-2026-0771",
    date: "25 Mar 2026",
    vendorName: "PT Infrastruktur Andalan",
    vendorTaxId: "04.567.890.1-234.000",
    itemDescription: "Perbaikan AC gedung lantai 3-5",
    businessUnit: "Building Management",
    requester: "Sigit Purnomo",
    approver: "Darmawan",
    amount: 42000000,
    fraudScore: 15,
    flags: [],
    status: "approved",
    procurementMethod: "Seleksi Langsung",
    aiExplanation: "Transaksi normal. Vendor terpercaya, 12 riwayat transaksi sebelumnya.",
  },
  {
    id: "PRC-0016",
    docNumber: "PO-2026-0798",
    date: "28 Mar 2026",
    vendorName: "UD Stationery Plus",
    vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q1",
    businessUnit: "General Affairs",
    requester: "Hendra Wijaya",
    approver: "Hendra Wijaya",
    amount: 3750000,
    fraudScore: 85,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "rejected",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Duplikasi dari PRC-0036. Ditolak oleh auditor senior.",
  },
  {
    id: "PRC-0017",
    docNumber: "PO-2026-0892",
    date: "10 Apr 2026",
    vendorName: "UD Stationery Plus",
    vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q2",
    businessUnit: "General Affairs",
    requester: "Hendra Wijaya",
    approver: "Hendra Wijaya",
    amount: 3750000,
    fraudScore: 91,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation:
      "Invoice identik dengan PRC-0021. Requester dan approver orang yang sama — pelanggaran Segregation of Duties.",
  },
  {
    id: "PRC-0018",
    docNumber: "PO-2026-0901",
    date: "12 Apr 2026",
    vendorName: "CV Maju Bersama",
    vendorTaxId: "07.891.234.5-678.000",
    itemDescription: "Pengadaan ATK & perlengkapan kantor",
    businessUnit: "Procurement",
    requester: "Dewi Rahayu",
    approver: "Suharto Wibowo",
    amount: 18500000,
    fraudScore: 74,
    flags: ["Price Markup", "Vendor Baru"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Vendor baru terdaftar 14 hari sebelum PO. Harga 280% di atas e-Katalog LKPP.",
  },
  {
    id: "PRC-0019",
    docNumber: "PO-2026-0887",
    date: "11 Apr 2026",
    vendorName: "PT Solusi Digital Indonesia",
    vendorTaxId: "03.456.789.0-123.000",
    itemDescription: "Jasa konsultasi pengembangan sistem IT",
    businessUnit: "IT",
    requester: "Rina Kusuma",
    approver: "Rina Kusuma",
    amount: 75000000,
    fraudScore: 61,
    flags: ["Self Approval", "Bypass Tender"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation:
      "Nilai Rp 75.000.000 seharusnya lewat tender terbuka (threshold Rp 50jt). Ada self-approval.",
  },
  {
    id: "PRC-0020",
    docNumber: "PO-2026-0829",
    date: "3 Apr 2026",
    vendorName: "CV Berkah Jaya Abadi",
    vendorTaxId: "05.678.901.2-345.000",
    itemDescription: "Catering rapat direksi Q2",
    businessUnit: "Secretary",
    requester: "Lina Marlina",
    approver: "Wawan Setiawan",
    amount: 8200000,
    fraudScore: 38,
    flags: ["Inflated Amount"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Rp 328.000/orang — 60% di atas rata-rata historis kategori ini.",
  },
  {
    id: "PRC-0021",
    docNumber: "PO-2026-0862",
    date: "8 Apr 2026",
    vendorName: "PT Mitra Teknologi Nusantara",
    vendorTaxId: "02.345.678.9-012.000",
    itemDescription: "Lisensi software ERP tahunan",
    businessUnit: "IT",
    requester: "Fajar Nugroho",
    approver: "Hendri Saputra",
    amount: 120000000,
    fraudScore: 22,
    flags: [],
    status: "auto-approved",
    procurementMethod: "Tender Terbuka",
    aiExplanation: "Tidak ditemukan anomali. Vendor terverifikasi, tender sesuai prosedur.",
  },
  {
    id: "PRC-0022",
    docNumber: "PO-2026-0771",
    date: "25 Mar 2026",
    vendorName: "PT Infrastruktur Andalan",
    vendorTaxId: "04.567.890.1-234.000",
    itemDescription: "Perbaikan AC gedung lantai 3-5",
    businessUnit: "Building Management",
    requester: "Sigit Purnomo",
    approver: "Darmawan",
    amount: 42000000,
    fraudScore: 15,
    flags: [],
    status: "approved",
    procurementMethod: "Seleksi Langsung",
    aiExplanation: "Transaksi normal. Vendor terpercaya, 12 riwayat transaksi sebelumnya.",
  },
  {
    id: "PRC-0023",
    docNumber: "PO-2026-0798",
    date: "28 Mar 2026",
    vendorName: "UD Stationery Plus",
    vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q1",
    businessUnit: "General Affairs",
    requester: "Hendra Wijaya",
    approver: "Hendra Wijaya",
    amount: 3750000,
    fraudScore: 85,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "rejected",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Duplikasi dari PRC-0036. Ditolak oleh auditor senior.",
  },
  {
    id: "PRC-0024",
    docNumber: "PO-2026-0892",
    date: "10 Apr 2026",
    vendorName: "UD Stationery Plus",
    vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q2",
    businessUnit: "General Affairs",
    requester: "Hendra Wijaya",
    approver: "Hendra Wijaya",
    amount: 3750000,
    fraudScore: 91,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation:
      "Invoice identik dengan PRC-0021. Requester dan approver orang yang sama — pelanggaran Segregation of Duties.",
  },
  {
    id: "PRC-0025",
    docNumber: "PO-2026-0901",
    date: "12 Apr 2026",
    vendorName: "CV Maju Bersama",
    vendorTaxId: "07.891.234.5-678.000",
    itemDescription: "Pengadaan ATK & perlengkapan kantor",
    businessUnit: "Procurement",
    requester: "Dewi Rahayu",
    approver: "Suharto Wibowo",
    amount: 18500000,
    fraudScore: 74,
    flags: ["Price Markup", "Vendor Baru"],
    status: "high-alert",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Vendor baru terdaftar 14 hari sebelum PO. Harga 280% di atas e-Katalog LKPP.",
  },
  {
    id: "PRC-0026",
    docNumber: "PO-2026-0887",
    date: "11 Apr 2026",
    vendorName: "PT Solusi Digital Indonesia",
    vendorTaxId: "03.456.789.0-123.000",
    itemDescription: "Jasa konsultasi pengembangan sistem IT",
    businessUnit: "IT",
    requester: "Rina Kusuma",
    approver: "Rina Kusuma",
    amount: 75000000,
    fraudScore: 61,
    flags: ["Self Approval", "Bypass Tender"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation:
      "Nilai Rp 75.000.000 seharusnya lewat tender terbuka (threshold Rp 50jt). Ada self-approval.",
  },
  {
    id: "PRC-0027",
    docNumber: "PO-2026-0829",
    date: "3 Apr 2026",
    vendorName: "CV Berkah Jaya Abadi",
    vendorTaxId: "05.678.901.2-345.000",
    itemDescription: "Catering rapat direksi Q2",
    businessUnit: "Secretary",
    requester: "Lina Marlina",
    approver: "Wawan Setiawan",
    amount: 8200000,
    fraudScore: 38,
    flags: ["Inflated Amount"],
    status: "pending",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Rp 328.000/orang — 60% di atas rata-rata historis kategori ini.",
  },
  {
    id: "PRC-0028",
    docNumber: "PO-2026-0862",
    date: "8 Apr 2026",
    vendorName: "PT Mitra Teknologi Nusantara",
    vendorTaxId: "02.345.678.9-012.000",
    itemDescription: "Lisensi software ERP tahunan",
    businessUnit: "IT",
    requester: "Fajar Nugroho",
    approver: "Hendri Saputra",
    amount: 120000000,
    fraudScore: 22,
    flags: [],
    status: "auto-approved",
    procurementMethod: "Tender Terbuka",
    aiExplanation: "Tidak ditemukan anomali. Vendor terverifikasi, tender sesuai prosedur.",
  },
  {
    id: "PRC-0029",
    docNumber: "PO-2026-0771",
    date: "25 Mar 2026",
    vendorName: "PT Infrastruktur Andalan",
    vendorTaxId: "04.567.890.1-234.000",
    itemDescription: "Perbaikan AC gedung lantai 3-5",
    businessUnit: "Building Management",
    requester: "Sigit Purnomo",
    approver: "Darmawan",
    amount: 42000000,
    fraudScore: 15,
    flags: [],
    status: "approved",
    procurementMethod: "Seleksi Langsung",
    aiExplanation: "Transaksi normal. Vendor terpercaya, 12 riwayat transaksi sebelumnya.",
  },
  {
    id: "PRC-0030",
    docNumber: "PO-2026-0798",
    date: "28 Mar 2026",
    vendorName: "UD Stationery Plus",
    vendorTaxId: "01.234.567.8-901.000",
    itemDescription: "Alat Tulis Kantor — bulk order Q1",
    businessUnit: "General Affairs",
    requester: "Hendra Wijaya",
    approver: "Hendra Wijaya",
    amount: 3750000,
    fraudScore: 85,
    flags: ["Duplicate Invoice", "Self Approval"],
    status: "rejected",
    procurementMethod: "Penunjukan Langsung",
    aiExplanation: "Duplikasi dari PRC-0036. Ditolak oleh auditor senior.",
  },
];

// ── Toggle ini untuk test empty state ─────────────────────────────────────────
// TODO integrasi: ganti dengan: const HAS_DATA = data.length > 0
export const HAS_DATA = true;