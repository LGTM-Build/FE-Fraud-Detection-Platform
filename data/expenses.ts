export type Status =
  | "auto-approved"
  | "pending"
  | "high-alert"
  | "approved"
  | "rejected";

export interface ExpenseTransaction {
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

export const mockExpenses: ExpenseTransaction[] = [
  {
    id: "EXP-0041",
    date: "12 Apr 2026",
    category: "Entertainment",
    description: "Dinner client - Sate Khas Senayan",
    merchant: "Sate Khas Senayan SCBD",
    employee: "Budi Santoso",
    department: "Sales",
    grade: "Manager",
    amount: 4200000,
    fraudScore: 82,
    flags: ["Inflated Amount", "Entertainment Abuse"],
    status: "high-alert",
    aiExplanation:
      "Nominal Rp 4.200.000 melebihi batas entertainment Manager (Rp 2.000.000). Pola pengeluaran serupa terdeteksi 3x dalam 30 hari terakhir dari karyawan yang sama.",
  },
  {
    id: "EXP-0039",
    date: "11 Apr 2026",
    category: "Transport",
    description: "Transport dinas Surabaya",
    merchant: "Grab Business",
    employee: "Ahmad Fauzi",
    department: "Operations",
    grade: "Staff",
    amount: 850000,
    fraudScore: 45,
    flags: ["Weekend Claim"],
    status: "pending",
    aiExplanation:
      "Klaim dilakukan pada hari Sabtu (hari libur). Tidak ada perjalanan dinas terdaftar pada tanggal tersebut.",
  },
  {
    id: "EXP-0037",
    date: "11 Apr 2026",
    category: "Office Supply",
    description: "Pembelian alat tulis kantor",
    merchant: "Gramedia",
    employee: "Siti Nurhaliza",
    department: "Finance",
    grade: "Staff",
    amount: 2100000,
    fraudScore: 18,
    flags: [],
    status: "auto-approved",
    aiExplanation:
      "Tidak ditemukan anomali. Nominal sesuai kebijakan, merchant terverifikasi, hari kerja normal.",
  },
  {
    id: "EXP-0035",
    date: "10 Apr 2026",
    category: "Meals",
    description: "Makan siang tim - 3 hari",
    merchant: "GoPay Food",
    employee: "Maya Indah",
    department: "Engineering",
    grade: "Staff",
    amount: 620000,
    fraudScore: 22,
    flags: [],
    status: "auto-approved",
    aiExplanation:
      "Klaim wajar. Nominal per hari sesuai batas kebijakan untuk kategori meals.",
  },
  {
    id: "EXP-0034",
    date: "10 Apr 2026",
    category: "Vehicle",
    description: "Servis kendaraan operasional",
    merchant: "Astra Daihatsu Service",
    employee: "Doni Prasetyo",
    department: "Operations",
    grade: "Supervisor",
    amount: 5800000,
    fraudScore: 55,
    flags: ["Inflated Amount"],
    status: "pending",
    aiExplanation:
      "Biaya servis Rp 5.800.000 berada di atas rata-rata untuk jenis kendaraan yang sama (rata-rata Rp 2.800.000). Disarankan verifikasi invoice asli dari bengkel.",
  },
  {
    id: "EXP-0031",
    date: "9 Apr 2026",
    category: "Entertainment",
    description: "Client meeting - Hotel Mulia",
    merchant: "Hotel Mulia Senayan",
    employee: "Rudi Hermawan",
    department: "Sales",
    grade: "Director",
    amount: 12500000,
    fraudScore: 67,
    flags: ["Missing Receipt", "Inflated Amount"],
    status: "pending",
    aiExplanation:
      "Struk tidak dilampirkan dalam pengajuan. Nominal di atas rata-rata entertainment Director, meskipun masih dalam batas policy.",
  },
  {
    id: "EXP-0028",
    date: "8 Apr 2026",
    category: "Training",
    description: "Online course subscription",
    merchant: "Udemy Business",
    employee: "Laila Sari",
    department: "HR",
    grade: "Staff",
    amount: 450000,
    fraudScore: 12,
    flags: [],
    status: "approved",
    aiExplanation:
      "Klaim disetujui. Nominal kecil, merchant terpercaya, sesuai program training perusahaan.",
  },
  {
    id: "EXP-0025",
    date: "7 Apr 2026",
    category: "Transport",
    description: "Tiket pesawat Jakarta-Bali",
    merchant: "Traveloka Business",
    employee: "Hendra Gunawan",
    department: "Marketing",
    grade: "Manager",
    amount: 3200000,
    fraudScore: 71,
    flags: ["Duplicate Claim", "Split Transaction"],
    status: "high-alert",
    aiExplanation:
      "Terdeteksi klaim tiket perjalanan yang sama dengan EXP-0019 tertanggal 2 Apr. Diduga split transaction untuk menghindari batas approval.",
  },
  {
    id: "EXP-0019",
    date: "2 Apr 2026",
    category: "Transport",
    description: "Tiket pesawat Jakarta-Bali (2)",
    merchant: "Tiket.com",
    employee: "Hendra Gunawan",
    department: "Marketing",
    grade: "Manager",
    amount: 3100000,
    fraudScore: 78,
    flags: ["Duplicate Claim"],
    status: "rejected",
    aiExplanation:
      "Klaim ini merupakan duplikasi dari perjalanan yang sama dengan EXP-0025. Sudah ditolak oleh auditor.",
  },
];

export type StatusConfig = {
  label: string;
  bg: string;
  color: string;
  border: string;
  dot: string;
};

export const statusConfig: Record<Status, StatusConfig> = {
  "auto-approved": {
    label: "Auto Approved",
    bg: "rgba(16,185,129,0.10)",
    color: "var(--em)",
    border: "rgba(16,185,129,0.20)",
    dot: "#10b981",
  },
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
    color: "var(--em)",
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
};

export type FilterStatus =
  | "all"
  | "pending"
  | "high-alert"
  | "approved"
  | "auto-approved"
  | "rejected";

export const FILTER_LABELS: Record<FilterStatus, string> = {
  all: "Semua",
  "high-alert": "High Alert",
  pending: "Pending Review",
  "auto-approved": "Auto Approved",
  approved: "Approved",
  rejected: "Rejected",
};

export function fmt(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}