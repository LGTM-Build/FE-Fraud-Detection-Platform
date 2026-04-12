export type Status = "auto-approved" | "pending" | "high-alert";
export type Module = "expense" | "procurement";
export type FilterModule = "all" | "expense" | "procurement";
export type FilterStatus = "all" | "pending" | "high-alert";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  employee: string;
  vendor?: string;
  amount: string;
  module: Module;
  fraudScore: number;
  flags: string[];
  status: Status;
};

export const mockData: Transaction[] = [
  {
    id: "TRX-0041",
    date: "12 Apr 2026",
    description: "Entertainment client - Dinner Sate Khas Senayan",
    employee: "Budi Santoso",
    amount: "Rp 4.200.000",
    module: "expense",
    fraudScore: 82,
    flags: ["Inflated Amount", "Entertainment Abuse"],
    status: "high-alert",
  },
  {
    id: "TRX-0040",
    date: "12 Apr 2026",
    description: "Pengadaan ATK - CV Maju Bersama",
    employee: "Dewi Rahayu",
    vendor: "CV Maju Bersama",
    amount: "Rp 18.500.000",
    module: "procurement",
    fraudScore: 74,
    flags: ["Price Markup", "Vendor Baru"],
    status: "high-alert",
  },
  {
    id: "TRX-0039",
    date: "11 Apr 2026",
    description: "Klaim transport dinas - Surabaya",
    employee: "Ahmad Fauzi",
    amount: "Rp 850.000",
    module: "expense",
    fraudScore: 45,
    flags: ["Weekend Claim"],
    status: "pending",
  },
  {
    id: "TRX-0038",
    date: "11 Apr 2026",
    description: "Jasa konsultasi IT - PT Solusi Digital",
    employee: "Rina Kusuma",
    vendor: "PT Solusi Digital",
    amount: "Rp 75.000.000",
    module: "procurement",
    fraudScore: 61,
    flags: ["Self Approval", "Bypass Tender"],
    status: "pending",
  },
  {
    id: "TRX-0037",
    date: "11 Apr 2026",
    description: "Pembelian peralatan kantor",
    employee: "Siti Nurhaliza",
    amount: "Rp 2.100.000",
    module: "expense",
    fraudScore: 18,
    flags: [],
    status: "auto-approved",
  },
  {
    id: "TRX-0036",
    date: "10 Apr 2026",
    description: "Duplicate invoice - Alat Tulis",
    employee: "Hendra Wijaya",
    vendor: "UD Stationery Plus",
    amount: "Rp 3.750.000",
    module: "procurement",
    fraudScore: 91,
    flags: ["Duplicate Invoice", "Price Markup"],
    status: "high-alert",
  },
  {
    id: "TRX-0035",
    date: "10 Apr 2026",
    description: "Klaim makan siang tim - 3 hari",
    employee: "Maya Indah",
    amount: "Rp 620.000",
    module: "expense",
    fraudScore: 22,
    flags: [],
    status: "auto-approved",
  },
  {
    id: "TRX-0034",
    date: "10 Apr 2026",
    description: "Servis kendaraan operasional",
    employee: "Doni Prasetyo",
    amount: "Rp 5.800.000",
    module: "expense",
    fraudScore: 55,
    flags: ["Inflated Amount"],
    status: "pending",
  },
];

export const statusConfig: Record<Status, {
  label: string; bg: string; color: string; border: string; dot: string;
}> = {
  "auto-approved": {
    label: "Auto Approved",
    bg: "rgba(16,185,129,0.10)",
    color: "var(--em)",
    border: "rgba(16,185,129,0.20)",
    dot: "#10b981",
  },
  "pending": {
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
};

export const moduleConfig: Record<Module, {
  label: string; bg: string; color: string; border: string;
}> = {
  expense: {
    label: "Expense",
    bg: "rgba(16,185,129,0.08)",
    color: "var(--em)",
    border: "rgba(16,185,129,0.15)",
  },
  procurement: {
    label: "Procurement",
    bg: "rgba(110,231,183,0.10)",
    color: "var(--ts)",
    border: "rgba(110,231,183,0.20)",
  },
};