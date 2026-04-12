export type VendorStatus = "active" | "watchlist" | "blacklisted";
export type FilterStatus = "all" | VendorStatus;

export interface VendorRelation {
  employeeName: string;
  employeeRole: string;
  relationType: string;
}

export interface Vendor {
  id: string;
  name: string;
  taxId: string;
  registeredDate: string;
  address: string;
  contact: string;
  status: VendorStatus;
  riskScore: number;
  totalTransactions: number;
  totalValue: number;
  flaggedTransactions: number;
  fraudFlags: string[];
  relations: VendorRelation[];
  lastTransaction: string;
  category: string;
  notes: string;
}

export const vendors: Vendor[] = [
  {
    id: "VND-001", name: "PT Cepat Untung Mandiri", taxId: "09.012.345.6-789.000",
    registeredDate: "2 Apr 2026", address: "Jl. Palmerah Barat No. 12, Jakarta",
    contact: "021-5551234", status: "blacklisted", riskScore: 94,
    totalTransactions: 3, totalValue: 165000000, flaggedTransactions: 3,
    fraudFlags: ["Shell Company", "Vendor Baru", "Price Markup", "Unverified Address"],
    relations: [
      { employeeName: "Anton Susilo", employeeRole: "Procurement Staff", relationType: "Keluarga (Kakak)" },
    ],
    lastTransaction: "5 Apr 2026", category: "Jasa Kebersihan",
    notes: "Vendor tidak dapat diverifikasi. NPWP tidak aktif di DJP. Alamat fiktif. Semua transaksi di-flag high alert.",
  },
  {
    id: "VND-002", name: "CV Maju Bersama", taxId: "07.891.234.5-678.000",
    registeredDate: "28 Mar 2026", address: "Jl. Raya Serpong No. 45, Tangerang",
    contact: "021-7778899", status: "watchlist", riskScore: 72,
    totalTransactions: 2, totalValue: 37000000, flaggedTransactions: 2,
    fraudFlags: ["Price Markup", "Vendor Baru"],
    relations: [],
    lastTransaction: "12 Apr 2026", category: "Alat Tulis & Perlengkapan",
    notes: "Vendor baru dengan harga markup signifikan. Dalam pengawasan — belum cukup data untuk blacklist.",
  },
  {
    id: "VND-003", name: "UD Stationery Plus", taxId: "01.234.567.8-901.000",
    registeredDate: "15 Jan 2023", address: "Jl. Kemang Raya No. 88, Jakarta Selatan",
    contact: "021-7171234", status: "watchlist", riskScore: 68,
    totalTransactions: 14, totalValue: 52500000, flaggedTransactions: 4,
    fraudFlags: ["Duplicate Invoice", "Self Approval"],
    relations: [
      { employeeName: "Hendra Wijaya", employeeRole: "GA Staff", relationType: "Vendor Langganan (Preferensial)" },
    ],
    lastTransaction: "10 Apr 2026", category: "Alat Tulis & Perlengkapan",
    notes: "Ditemukan pola duplicate invoice berulang. Requester selalu karyawan yang sama. Masuk watchlist untuk monitoring.",
  },
  {
    id: "VND-004", name: "PT Solusi Digital Indonesia", taxId: "03.456.789.0-123.000",
    registeredDate: "12 Feb 2021", address: "Gedung Cyber 2 Lt. 15, Jakarta Selatan",
    contact: "021-5225678", status: "watchlist", riskScore: 55,
    totalTransactions: 6, totalValue: 285000000, flaggedTransactions: 2,
    fraudFlags: ["Bypass Tender", "Self Approval"],
    relations: [],
    lastTransaction: "11 Apr 2026", category: "Jasa IT & Konsultasi",
    notes: "Vendor legitimate namun ada 2 transaksi yang bypass tender. Self-approval ditemukan pada PO terakhir.",
  },
  {
    id: "VND-005", name: "PT Mitra Teknologi Nusantara", taxId: "02.345.678.9-012.000",
    registeredDate: "3 Jun 2019", address: "Jl. TB Simatupang No. 17, Jakarta",
    contact: "021-7834567", status: "active", riskScore: 18,
    totalTransactions: 22, totalValue: 1240000000, flaggedTransactions: 0,
    fraudFlags: [],
    relations: [],
    lastTransaction: "8 Apr 2026", category: "Software & Lisensi",
    notes: "Vendor terpercaya. Track record bersih selama 5 tahun. Semua transaksi melalui tender resmi.",
  },
  {
    id: "VND-006", name: "PT Infrastruktur Andalan", taxId: "04.567.890.1-234.000",
    registeredDate: "20 Aug 2018", address: "Jl. Gatot Subroto No. 99, Jakarta",
    contact: "021-5274321", status: "active", riskScore: 12,
    totalTransactions: 18, totalValue: 890000000, flaggedTransactions: 1,
    fraudFlags: [],
    relations: [],
    lastTransaction: "25 Mar 2026", category: "Fasilitas & Gedung",
    notes: "Vendor lama dan terpercaya. Satu transaksi sempat di-flag karena nominal besar namun sudah diverifikasi.",
  },
];

export type StatusConfig = {
  label: string;
  bg: string;
  color: string;
  border: string;
  dot: string;
};

export const statusConfig: Record<VendorStatus, StatusConfig> = {
  active:      { label: "Active",      bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  watchlist:   { label: "Watchlist",   bg: "rgba(245,158,11,0.10)", color: "#d97706", border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  blacklisted: { label: "Blacklisted", bg: "rgba(239,68,68,0.10)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#ef4444" },
};

export const FILTER_LABELS: Record<FilterStatus, string> = {
  all: "Semua",
  active: "Active",
  watchlist: "Watchlist",
  blacklisted: "Blacklisted",
};

export function fmt(n: number): string {
  if (n >= 1000000000) return "Rp " + (n / 1000000000).toFixed(1) + "M";
  if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(0) + "jt";
  return "Rp " + n.toLocaleString("id-ID");
}