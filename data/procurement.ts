export type Status =
  | "auto-approved"
  | "pending"
  | "high-alert"
  | "approved"
  | "rejected";

export type FilterStatus =
  | "all"
  | "pending"
  | "high-alert"
  | "approved"
  | "auto-approved"
  | "rejected";

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
  status: Status;
  procurementMethod: string;
  aiExplanation: string;
}

export const mockData: ProcurementTransaction[] = [
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

export type StatusConfig = {
  label: string;
  bg: string;
  color: string;
  border: string;
  dot: string;
};

export const statusConfig: Record<Status, StatusConfig> = {
  "auto-approved": { label: "Auto Approved", bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  "pending":       { label: "Pending Review", bg: "rgba(245,158,11,0.10)", color: "#d97706", border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  "high-alert":    { label: "High Alert", bg: "rgba(239,68,68,0.10)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#ef4444" },
  "approved":      { label: "Approved", bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  "rejected":      { label: "Rejected", bg: "rgba(100,100,100,0.10)", color: "var(--tm)", border: "var(--border)", dot: "var(--tm)" },
};

export const FILTER_LABELS: Record<FilterStatus, string> = {
  all: "Semua",
  "high-alert": "High Alert",
  pending: "Pending",
  "auto-approved": "Auto Approved",
  approved: "Approved",
  rejected: "Rejected",
};

export function fmt(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}