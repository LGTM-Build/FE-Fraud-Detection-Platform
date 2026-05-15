// ─── Types ─────────────────────────────────────────────────────────────────────
// TODO integrasi: sesuaikan dengan response GET /api/procurement-transactions

// Status pakai underscore ikut BE
export type ProcurementStatus =
  | "pending"       // Data masih diproses ML
  | "alert"         // Fraud score 30–70, perlu ditinjau
  | "high_alert"    // Fraud score > 70, risiko tinggi
  | "auto_approved" // Disetujui otomatis oleh AI
  | "approved"      // Disetujui auditor
  | "rejected";     // Ditolak auditor

// Tab view
export type ViewTab = "review" | "pending" | "history";

// Filter per tab
export type ReviewFilter  = "all" | "high_alert" | "alert";
export type PendingFilter = "all";
export type HistoryFilter = "all" | "approved" | "auto_approved" | "rejected";

// Procurement method — hardcode enum ikut BE
export type ProcurementMethod =
  | "pengadaan_langsung"
  | "tender_terbuka"
  | "penunjukan_langsung"
  | "seleksi_langsung"
  | "e_purchasing";

// ─── Main transaction type ─────────────────────────────────────────────────────
export interface ProcurementTransaction {
  id: string;
  purchaseId: string | null;
  purchaseDate: string;           // ISO string dari BE
  vendorName: string;
  itemDescription: string;
  department: string | null;
  amountTotal: number;
  fraudScore: number | null;      // null kalau masih pending ML
  flags: string[];                // array of string
  status: ProcurementStatus;
  procurementMethod: ProcurementMethod;
  aiExplanation: string | null;   // null kalau masih pending ML
  employeeId: string | null;
  employeeName: string | null;    // di-join di BE
  requesterId: string;
  requesterName: string;          // di-join di BE
  reviewerName: string | null;    // dari updatedBy saat status berubah
  createdAt: string;
  updatedAt: string;
}

// ─── Status config (UI) ────────────────────────────────────────────────────────
export const statusConfig: Record<ProcurementStatus, {
  label: string; bg: string; color: string; border: string; dot: string;
}> = {
  pending: {
    label: "Menunggu AI",
    bg: "rgba(99,102,241,0.08)",
    color: "#6366f1",
    border: "rgba(99,102,241,0.20)",
    dot: "#6366f1",
  },
  alert: {
    label: "Perlu Ditinjau",
    bg: "rgba(245,158,11,0.10)",
    color: "#d97706",
    border: "rgba(245,158,11,0.20)",
    dot: "#f59e0b",
  },
  high_alert: {
    label: "Risiko Tinggi",
    bg: "rgba(239,68,68,0.10)",
    color: "#dc2626",
    border: "rgba(239,68,68,0.20)",
    dot: "#ef4444",
  },
  approved: {
    label: "Disetujui",
    bg: "rgba(16,185,129,0.10)",
    color: "var(--em)",
    border: "rgba(16,185,129,0.20)",
    dot: "#10b981",
  },
  auto_approved: {
    label: "Disetujui Otomatis",
    bg: "rgba(16,185,129,0.06)",
    color: "var(--em)",
    border: "rgba(16,185,129,0.15)",
    dot: "#10b981",
  },
  rejected: {
    label: "Ditolak",
    bg: "rgba(100,100,100,0.08)",
    color: "var(--tm)",
    border: "var(--border)",
    dot: "var(--tm)",
  },
};

// ─── Procurement method labels ─────────────────────────────────────────────────
export const procurementMethodLabels: Record<ProcurementMethod, string> = {
  pengadaan_langsung:  "Pengadaan Langsung",
  tender_terbuka:      "Tender Terbuka",
  penunjukan_langsung: "Penunjukan Langsung",
  seleksi_langsung:    "Seleksi Langsung",
  e_purchasing:        "E-Purchasing",
};

// Untuk dropdown di form tambah manual
export const PROCUREMENT_METHOD_OPTIONS = Object.entries(procurementMethodLabels).map(
  ([value, label]) => ({ value: value as ProcurementMethod, label })
);

// ─── Status grouping ───────────────────────────────────────────────────────────
export const REVIEW_STATUSES:  ProcurementStatus[] = ["high_alert", "alert"];
export const PENDING_STATUSES: ProcurementStatus[] = ["pending"];
export const HISTORY_STATUSES: ProcurementStatus[] = ["approved", "auto_approved", "rejected"];

// ─── Tab config ────────────────────────────────────────────────────────────────
export const VIEW_TABS_CONFIG: { key: ViewTab; label: string }[] = [
  { key: "review",  label: "Perlu Ditinjau" },
  { key: "pending", label: "Menunggu AI" },
  { key: "history", label: "Riwayat" },
];

// ─── Filter configs ────────────────────────────────────────────────────────────
export const REVIEW_FILTERS_CONFIG: { key: ReviewFilter; label: string }[] = [
  { key: "all",        label: "Semua" },
  { key: "high_alert", label: "Risiko Tinggi" },
  { key: "alert",      label: "Perlu Ditinjau" },
];

export const HISTORY_FILTERS_CONFIG: { key: HistoryFilter; label: string }[] = [
  { key: "all",          label: "Semua" },
  { key: "approved",     label: "Disetujui" },
  { key: "auto_approved",label: "Disetujui Otomatis" },
  { key: "rejected",     label: "Ditolak" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtCompact = (n: number) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000)         return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return fmt(n);
};

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });

// ─── Mock data ─────────────────────────────────────────────────────────────────
// TODO integrasi: hapus ini, ganti dengan fetch ke:
// GET /api/procurement-transactions?status=high_alert,alert   → tab Perlu Ditinjau
// GET /api/procurement-transactions?status=pending            → tab Menunggu AI
// GET /api/procurement-transactions?status=approved,auto_approved,rejected → tab Riwayat
export const MOCK_DATA: ProcurementTransaction[] = [
  {
    id: "uuid-001",
    purchaseId: "PRC-0036",
    purchaseDate: "2026-04-10T08:00:00.000Z",
    vendorName: "UD Stationery Plus",
    itemDescription: "Alat Tulis Kantor — bulk order Q2",
    department: "General Affairs",
    amountTotal: 3750000,
    fraudScore: 91,
    flags: ["Duplikasi Invoice", "Persetujuan Mandiri"],
    status: "high_alert",
    procurementMethod: "penunjukan_langsung",
    aiExplanation: "Invoice identik dengan PRC-0021. Pemohon dan penyetuju adalah orang yang sama — pelanggaran pemisahan tugas.",
    employeeId: "emp-uuid-001",
    employeeName: "Hendra Wijaya",
    requesterId: "user-uuid-001",
    requesterName: "Dewi Operator",
    reviewerName: null,
    createdAt: "2026-04-10T08:00:00.000Z",
    updatedAt: "2026-04-10T08:00:00.000Z",
  },
  {
    id: "uuid-002",
    purchaseId: "PRC-0040",
    purchaseDate: "2026-04-12T09:00:00.000Z",
    vendorName: "CV Maju Bersama",
    itemDescription: "Pengadaan ATK & perlengkapan kantor",
    department: "Procurement",
    amountTotal: 18500000,
    fraudScore: 74,
    flags: ["Markup Harga", "Vendor Baru"],
    status: "high_alert",
    procurementMethod: "penunjukan_langsung",
    aiExplanation: "Vendor baru terdaftar 14 hari sebelum PO. Harga 280% di atas e-Katalog LKPP.",
    employeeId: "emp-uuid-002",
    employeeName: "Dewi Rahayu",
    requesterId: "user-uuid-001",
    requesterName: "Dewi Operator",
    reviewerName: null,
    createdAt: "2026-04-12T09:00:00.000Z",
    updatedAt: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "uuid-003",
    purchaseId: "PRC-0038",
    purchaseDate: "2026-04-11T10:00:00.000Z",
    vendorName: "PT Solusi Digital Indonesia",
    itemDescription: "Jasa konsultasi pengembangan sistem IT",
    department: "IT",
    amountTotal: 75000000,
    fraudScore: 52,
    flags: ["Lewati Proses Tender"],
    status: "alert",
    procurementMethod: "penunjukan_langsung",
    aiExplanation: "Nilai Rp 75.000.000 seharusnya melalui tender terbuka (ambang batas Rp 50jt).",
    employeeId: "emp-uuid-003",
    employeeName: "Rina Kusuma",
    requesterId: "user-uuid-001",
    requesterName: "Dewi Operator",
    reviewerName: null,
    createdAt: "2026-04-11T10:00:00.000Z",
    updatedAt: "2026-04-11T10:00:00.000Z",
  },
  {
    id: "uuid-004",
    purchaseId: "PRC-0027",
    purchaseDate: "2026-04-03T07:00:00.000Z",
    vendorName: "CV Berkah Jaya Abadi",
    itemDescription: "Katering rapat direksi Q2",
    department: "Sekretariat",
    amountTotal: 8200000,
    fraudScore: 38,
    flags: ["Nilai Tidak Wajar"],
    status: "alert",
    procurementMethod: "pengadaan_langsung",
    aiExplanation: "Rp 328.000 per orang — 60% di atas rata-rata historis kategori ini.",
    employeeId: "emp-uuid-004",
    employeeName: "Lina Marlina",
    requesterId: "user-uuid-001",
    requesterName: "Dewi Operator",
    reviewerName: null,
    createdAt: "2026-04-03T07:00:00.000Z",
    updatedAt: "2026-04-03T07:00:00.000Z",
  },
  {
    id: "uuid-005",
    purchaseId: "PRC-0045",
    purchaseDate: "2026-04-14T11:00:00.000Z",
    vendorName: "PT Bangun Karya Nusantara",
    itemDescription: "Renovasi ruang meeting lantai 2",
    department: "Building Management",
    amountTotal: 95000000,
    fraudScore: null,
    flags: [],
    status: "pending",
    procurementMethod: "tender_terbuka",
    aiExplanation: null,
    employeeId: "emp-uuid-005",
    employeeName: "Sigit Purnomo",
    requesterId: "user-uuid-002",
    requesterName: "Budi Operator",
    reviewerName: null,
    createdAt: "2026-04-14T11:00:00.000Z",
    updatedAt: "2026-04-14T11:00:00.000Z",
  },
  {
    id: "uuid-006",
    purchaseId: "PRC-0043",
    purchaseDate: "2026-04-13T08:30:00.000Z",
    vendorName: "CV Teknologi Maju",
    itemDescription: "Pengadaan printer & toner Q2",
    department: "General Affairs",
    amountTotal: 12000000,
    fraudScore: null,
    flags: [],
    status: "pending",
    procurementMethod: "pengadaan_langsung",
    aiExplanation: null,
    employeeId: "emp-uuid-001",
    employeeName: "Hendra Wijaya",
    requesterId: "user-uuid-002",
    requesterName: "Budi Operator",
    reviewerName: null,
    createdAt: "2026-04-13T08:30:00.000Z",
    updatedAt: "2026-04-13T08:30:00.000Z",
  },
  {
    id: "uuid-007",
    purchaseId: "PRC-0033",
    purchaseDate: "2026-04-08T09:00:00.000Z",
    vendorName: "PT Mitra Teknologi Nusantara",
    itemDescription: "Lisensi software ERP tahunan",
    department: "IT",
    amountTotal: 120000000,
    fraudScore: 22,
    flags: [],
    status: "auto_approved",
    procurementMethod: "tender_terbuka",
    aiExplanation: "Tidak ditemukan anomali. Vendor terverifikasi, tender sesuai prosedur.",
    employeeId: "emp-uuid-006",
    employeeName: "Fajar Nugroho",
    requesterId: "user-uuid-001",
    requesterName: "Dewi Operator",
    reviewerName: null,
    createdAt: "2026-04-08T09:00:00.000Z",
    updatedAt: "2026-04-08T09:00:00.000Z",
  },
  {
    id: "uuid-008",
    purchaseId: "PRC-0018",
    purchaseDate: "2026-03-25T07:00:00.000Z",
    vendorName: "PT Infrastruktur Andalan",
    itemDescription: "Perbaikan AC gedung lantai 3-5",
    department: "Building Management",
    amountTotal: 42000000,
    fraudScore: 15,
    flags: [],
    status: "approved",
    procurementMethod: "seleksi_langsung",
    aiExplanation: "Transaksi normal. Vendor terpercaya, 12 riwayat transaksi sebelumnya.",
    employeeId: "emp-uuid-005",
    employeeName: "Sigit Purnomo",
    requesterId: "user-uuid-001",
    requesterName: "Dewi Operator",
    reviewerName: "Sari Auditor",
    createdAt: "2026-03-25T07:00:00.000Z",
    updatedAt: "2026-03-26T10:00:00.000Z",
  },
  {
    id: "uuid-009",
    purchaseId: "PRC-0021",
    purchaseDate: "2026-03-28T08:00:00.000Z",
    vendorName: "UD Stationery Plus",
    itemDescription: "Alat Tulis Kantor — bulk order Q1",
    department: "General Affairs",
    amountTotal: 3750000,
    fraudScore: 85,
    flags: ["Duplikasi Invoice", "Persetujuan Mandiri"],
    status: "rejected",
    procurementMethod: "penunjukan_langsung",
    aiExplanation: "Duplikasi dari PRC-0036. Ditolak oleh auditor senior.",
    employeeId: "emp-uuid-001",
    employeeName: "Hendra Wijaya",
    requesterId: "user-uuid-001",
    requesterName: "Dewi Operator",
    reviewerName: "Sari Auditor",
    createdAt: "2026-03-28T08:00:00.000Z",
    updatedAt: "2026-03-29T14:00:00.000Z",
  },
];

// Toggle untuk test empty state
// TODO integrasi: hapus ini, ganti dengan: const HAS_DATA = data.length > 0
export const HAS_DATA = true;

// ─── Fraud risk config (dipakai ProcurementTable & DetailDrawer) ───────────────
export function getFraudRiskConfig(score: number | null) {
  if (score === null) return {
    color: "#6366f1", bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.20)", label: "Menunggu AI",
  };
  if (score >= 70) return {
    color: "#ef4444", bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.20)", label: "Risiko Tinggi",
  };
  if (score >= 30) return {
    color: "#f59e0b", bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.20)", label: "Perlu Ditinjau",
  };
  return {
    color: "#10b981", bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.20)", label: "Aman",
  };
}

// ─── Table column headers ──────────────────────────────────────────────────────
export const TABLE_COL_HEADERS = [
  "ID Pembelian", "Tanggal", "Vendor", "Item & Karyawan",
  "Departemen", "Metode", "Total", "Skor", "Temuan AI", "Status", "",
];