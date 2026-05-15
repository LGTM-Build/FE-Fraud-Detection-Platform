// ─── Types ─────────────────────────────────────────────────────────────────────
// Status pakai underscore ikut BE
export type ExpenseStatus =
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

// Expense category
export type ExpenseCategory =
  | "entertainment"
  | "transport"
  | "office_supply"
  | "meals"
  | "vehicle"
  | "training"
  | "others";

// ─── Main transaction type ─────────────────────────────────────────────────────
export interface ExpenseTransaction {
  id: string;
  expenseId: string | null;
  expenseDate: string;           // ISO string dari BE
  description: string;
  category: ExpenseCategory;
  merchant: string;
  department: string | null;
  amountTotal: number;
  fraudScore: number | null;      // null kalau masih pending ML
  flags: string[];  // array dengan string flags
  status: ExpenseStatus;
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
export const statusConfig: Record<ExpenseStatus, {
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

// ─── Expense category labels ─────────────────────────────────────────────────
export const procurementCategoryLabels: Record<ExpenseCategory, string> = {
  entertainment: "Hiburan",
  transport: "Transportasi",
  office_supply: "Perlengkapan Kantor",
  meals: "Makan & Minum",
  vehicle: "Kendaraan",
  training: "Pelatihan",
  others: "Lainnya",
};

// ─── Status grouping ───────────────────────────────────────────────────────────
export const REVIEW_STATUSES:  ExpenseStatus[] = ["high_alert", "alert"];
export const PENDING_STATUSES: ExpenseStatus[] = ["pending"];
export const HISTORY_STATUSES: ExpenseStatus[] = ["approved", "auto_approved", "rejected"];

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
// GET /api/expenses?status=high_alert,alert   → tab Perlu Ditinjau
// GET /api/expenses?status=pending            → tab Menunggu AI
// GET /api/expenses?status=approved,auto_approved,rejected → tab Riwayat
export const MOCK_DATA: ExpenseTransaction[] = [
  {
    id: "uuid-001",
    expenseId: "EXP-2026-001",
    expenseDate: "2026-04-10T08:00:00.000Z",
    description: "Client meeting at Senayan City",
    category: "meals",
    merchant: "Restoran Grand Hyatt",
    department: "Sales",
    amountTotal: 2500000,
    fraudScore: 10,
    flags: ["amount_reasonable", "merchant_known"],
    status: "approved",
    aiExplanation: "Low fraud risk - normal business meal expense.",
    employeeId: "emp-uuid-001",
    employeeName: "Ahmad Pratama",
    requesterId: "user-uuid-001",
    requesterName: "Siti Operator",
    reviewerName: "Budi Auditor",
    createdAt: "2026-04-10T08:00:00.000Z",
    updatedAt: "2026-04-10T10:00:00.000Z",
  },
  {
    id: "uuid-002",
    expenseId: "EXP-2026-002",
    expenseDate: "2026-04-12T09:00:00.000Z",
    description: "Taxi to Airport & Hotel Jakarta",
    category: "transport",
    merchant: "Blue Bird Taxi & Oakwood Residence",
    department: "Finance",
    amountTotal: 3500000,
    fraudScore: 35,
    flags: ["late_submission", "amount_slightly_high"],
    status: "pending",
    aiExplanation: "Medium fraud risk - late submission and amount above expected.",
    employeeId: "emp-uuid-002",
    employeeName: "Dewi Rahayu",
    requesterId: "user-uuid-001",
    requesterName: "Siti Operator",
    reviewerName: null,
    createdAt: "2026-04-12T09:00:00.000Z",
    updatedAt: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "uuid-003",
    expenseId: "EXP-2026-003",
    expenseDate: "2026-04-11T10:00:00.000Z",
    description: "Training Course - Advanced Procurement",
    category: "training",
    merchant: "PT. Training Institute",
    department: "Procurement",
    amountTotal: 5000000,
    fraudScore: 65,
    flags: ["no_receipt", "unusual_vendor", "high_amount"],
    status: "alert",
    aiExplanation: "High fraud risk - no receipt provided, unusual vendor, and high amount.",
    employeeId: "emp-uuid-003",
    employeeName: "Rina Kusuma",
    requesterId: "user-uuid-001",
    requesterName: "Siti Operator",
    reviewerName: null,
    createdAt: "2026-04-11T10:00:00.000Z",
    updatedAt: "2026-04-11T10:00:00.000Z",
  },
  {
    id: "uuid-004",
    expenseId: "EXP-2026-004",
    expenseDate: "2026-04-09T14:00:00.000Z",
    description: "Office stationery supplies",
    category: "office_supply",
    merchant: "Gramedia Business",
    department: "HR",
    amountTotal: 1200000,
    fraudScore: 15,
    flags: ["merchant_known", "amount_within_limit"],
    status: "auto_approved",
    aiExplanation: "Low fraud risk - normal office supply expense, merchant verified.",
    employeeId: "emp-uuid-004",
    employeeName: "Lina Marlina",
    requesterId: "user-uuid-002",
    requesterName: "Budi Operator",
    reviewerName: null,
    createdAt: "2026-04-09T14:00:00.000Z",
    updatedAt: "2026-04-09T14:00:00.000Z",
  },
  {
    id: "uuid-005",
    expenseId: "EXP-2026-005",
    expenseDate: "2026-04-08T07:00:00.000Z",
    description: "Vehicle maintenance - service Avanza",
    category: "vehicle",
    merchant: "Astra Daihatsu Service Center",
    department: "Operations",
    amountTotal: 5800000,
    fraudScore: 55,
    flags: ["inflated_amount", "higher_than_usual"],
    status: "alert",
    aiExplanation: "Medium-high fraud risk - service cost 2x higher than historical average.",
    employeeId: "emp-uuid-005",
    employeeName: "Sigit Purnomo",
    requesterId: "user-uuid-002",
    requesterName: "Budi Operator",
    reviewerName: null,
    createdAt: "2026-04-08T07:00:00.000Z",
    updatedAt: "2026-04-08T07:00:00.000Z",
  },
  {
    id: "uuid-006",
    expenseId: "EXP-2026-006",
    expenseDate: "2026-04-07T11:00:00.000Z",
    description: "Client entertainment - dinner meeting",
    category: "entertainment",
    merchant: "Hotel Mulia Senayan",
    department: "Sales",
    amountTotal: 12500000,
    fraudScore: 72,
    flags: ["missing_receipt", "inflated_amount"],
    status: "high_alert",
    aiExplanation: "High fraud risk - no receipt provided and amount significantly above policy limit.",
    employeeId: "emp-uuid-006",
    employeeName: "Rudi Hermawan",
    requesterId: "user-uuid-001",
    requesterName: "Siti Operator",
    reviewerName: null,
    createdAt: "2026-04-07T11:00:00.000Z",
    updatedAt: "2026-04-07T11:00:00.000Z",
  },
  {
    id: "uuid-007",
    expenseId: "EXP-2026-007",
    expenseDate: "2026-04-06T16:00:00.000Z",
    description: "Team lunch - catering",
    category: "meals",
    merchant: "GoPay Food Catering",
    department: "Engineering",
    amountTotal: 2100000,
    fraudScore: 18,
    flags: ["quantity_appropriate"],
    status: "auto_approved",
    aiExplanation: "Low fraud risk - reasonable team meal expense, amount within guidelines.",
    employeeId: "emp-uuid-007",
    employeeName: "Maya Indah",
    requesterId: "user-uuid-002",
    requesterName: "Budi Operator",
    reviewerName: null,
    createdAt: "2026-04-06T16:00:00.000Z",
    updatedAt: "2026-04-06T16:00:00.000Z",
  },
  {
    id: "uuid-008",
    expenseId: "EXP-2026-008",
    expenseDate: "2026-04-05T15:00:00.000Z",
    description: "Online course - Data Analytics certification",
    category: "training",
    merchant: "Udemy Business",
    department: "IT",
    amountTotal: 450000,
    fraudScore: 12,
    flags: ["legitimate_training"],
    status: "approved",
    aiExplanation: "Low fraud risk - legitimate training expense, approved by department head.",
    employeeId: "emp-uuid-008",
    employeeName: "Hendra Wijaya",
    requesterId: "user-uuid-001",
    requesterName: "Siti Operator",
    reviewerName: "Budi Auditor",
    createdAt: "2026-04-05T15:00:00.000Z",
    updatedAt: "2026-04-05T16:30:00.000Z",
  },
  {
    id: "uuid-009",
    expenseId: "EXP-2026-009",
    expenseDate: "2026-04-04T13:00:00.000Z",
    description: "Flight ticket Jakarta-Bali (Duplicate)",
    category: "transport",
    merchant: "Traveloka Business",
    department: "Marketing",
    amountTotal: 3200000,
    fraudScore: 81,
    flags: ["duplicate_transaction", "split_claim"],
    status: "high_alert",
    aiExplanation: "High fraud risk - duplicate claim detected, appears to be transaction splitting.",
    employeeId: "emp-uuid-009",
    employeeName: "Hendra Gunawan",
    requesterId: "user-uuid-001",
    requesterName: "Siti Operator",
    reviewerName: null,
    createdAt: "2026-04-04T13:00:00.000Z",
    updatedAt: "2026-04-04T13:00:00.000Z",
  },
  {
    id: "uuid-010",
    expenseId: "EXP-2026-010",
    expenseDate: "2026-04-03T08:00:00.000Z",
    description: "Business lunch expense",
    category: "meals",
    merchant: "Restoran XYZ",
    department: "Finance",
    amountTotal: 750000,
    fraudScore: null,
    flags: [],
    status: "pending",
    aiExplanation: null,
    employeeId: "emp-uuid-010",
    employeeName: "Laila Sari",
    requesterId: "user-uuid-002",
    requesterName: "Budi Operator",
    reviewerName: null,
    createdAt: "2026-04-03T08:00:00.000Z",
    updatedAt: "2026-04-03T08:00:00.000Z",
  },
];

export const HAS_DATA = MOCK_DATA.length > 0;

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
  "ID Pembelian", "Tanggal", "Karyawan", "Deskripsi",
  "Departemen", "Kategori", "Total", "Skor", "Temuan AI", "Status", "",
];