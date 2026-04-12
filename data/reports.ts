export type ReportFormat = "pdf" | "excel";
export type ReportScope = "all" | "expense" | "procurement";
export type ReportType = "summary" | "detail" | "vendor" | "employee";
export type GenerateState = "idle" | "generating" | "done";

export interface ReportHistory {
  id: string;
  name: string;
  type: ReportType;
  scope: ReportScope;
  period: string;
  format: ReportFormat;
  generatedAt: string;
  generatedBy: string;
  pages: number;
  size: string;
}

export const reportHistory: ReportHistory[] = [
  { id: "RPT-012", name: "Laporan Audit Q1 2026",       type: "detail",   scope: "all",         period: "Jan – Mar 2026",  format: "pdf",   generatedAt: "1 Apr 2026, 09:00",  generatedBy: "Dewi Rahayu",  pages: 84,  size: "3.2 MB" },
  { id: "RPT-011", name: "Ringkasan Fraud Maret 2026",  type: "summary",  scope: "expense",     period: "Mar 2026",        format: "pdf",   generatedAt: "31 Mar 2026, 17:45", generatedBy: "Rina Kusuma",  pages: 12,  size: "0.8 MB" },
  { id: "RPT-010", name: "Detail Transaksi Vendor Feb", type: "vendor",   scope: "procurement", period: "Feb 2026",        format: "excel", generatedAt: "3 Mar 2026, 11:20",  generatedBy: "Dewi Rahayu",  pages: 210, size: "5.1 MB" },
  { id: "RPT-009", name: "Laporan Karyawan Berisiko",   type: "employee", scope: "expense",     period: "Jan – Feb 2026",  format: "excel", generatedAt: "1 Mar 2026, 08:30",  generatedBy: "Anton Susilo", pages: 45,  size: "1.7 MB" },
  { id: "RPT-008", name: "Laporan Audit Q4 2025",       type: "detail",   scope: "all",         period: "Okt – Des 2025",  format: "pdf",   generatedAt: "5 Jan 2026, 10:00",  generatedBy: "Rina Kusuma",  pages: 112, size: "4.6 MB" },
];

export const scopeLabels: Record<ReportScope, string> = {
  all: "Semua",
  expense: "Expense",
  procurement: "Procurement",
};

export const typeLabels: Record<ReportType, string> = {
  summary:  "Ringkasan Eksekutif",
  detail:   "Detail Lengkap",
  vendor:   "Profil Vendor",
  employee: "Analisis Karyawan",
};

export const typeDescs: Record<ReportType, string> = {
  summary:  "Ringkasan high-level untuk CFO/Direksi. Grafik tren, total exposure, top fraud flags.",
  detail:   "Laporan audit lengkap dengan seluruh transaksi, AI explanation, dan audit trail.",
  vendor:   "Profil risiko per vendor, riwayat transaksi, dan relasi karyawan.",
  employee: "Analisis pola klaim per karyawan, outlier, dan perbandingan antar departemen.",
};

export const PERIOD_SHORTCUTS = [
  { label: "Bulan ini", start: "2026-04-01", end: "2026-04-30" },
  { label: "Q1 2026",   start: "2026-01-01", end: "2026-03-31" },
  { label: "Q4 2025",   start: "2025-10-01", end: "2025-12-31" },
  { label: "2025",      start: "2025-01-01", end: "2025-12-31" },
];