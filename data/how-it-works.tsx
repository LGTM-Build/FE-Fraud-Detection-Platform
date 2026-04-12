export type Step = {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  detail: string;
  icon: React.ReactNode;
};

export const steps: Step[] = [
  {
    num: "01",
    title: "Upload CSV Anda",
    subtitle: "Format apapun diterima",
    desc: "Upload file CSV langsung dari sistem ERP Anda — SAP, Odoo, Accurate, Jurnal.id, atau bahkan Excel manual. Tidak perlu ubah format terlebih dahulu.",
    detail: "AI kami mendukung encoding UTF-8, ISO-8859-1, dan format tanggal apapun.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "AI Auto-Mapping",
    subtitle: "Smart CSV Mapper bekerja",
    desc: "AI langsung mendeteksi kolom: tanggal transaksi, nominal, vendor, karyawan, kategori — dari format apapun. Anda hanya perlu konfirmasi, bukan mapping manual.",
    detail: "Menggunakan rapidfuzz + LLM Claude untuk kolom ambigu. Template disimpan otomatis.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
        <path d="M16.24 7.76a6 6 0 010 8.49M7.76 7.76a6 6 0 000 8.49"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "AI Analisis Fraud",
    subtitle: "Scoring engine berjalan",
    desc: "Isolation Forest menganalisis setiap transaksi dan memberikan fraud score 0–100. Red flags dideteksi: vendor fiktif, markup ekstrem, double claim, struk palsu.",
    detail: "Setiap flag disertai penjelasan dalam Bahasa Indonesia yang mudah dipahami auditor.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Review & Eskalasi",
    subtitle: "Dashboard auditor",
    desc: "Auditor mereview transaksi yang di-flag melalui dashboard — approve, reject, atau escalate ke manajemen. Semua aksi tercatat dalam audit trail yang immutable.",
    detail: "Role-based access: Admin / Auditor / Viewer. Notifikasi real-time via email.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Laporan Audit Siap",
    subtitle: "Ekspor PDF & Excel",
    desc: "Generate laporan audit lengkap dengan satu klik — PDF presentasi untuk direksi atau Excel detail untuk auditor eksternal. Termasuk ringkasan eksekutif dan grafik temuan.",
    detail: "Laporan memenuhi standar audit internal Indonesia dan siap digunakan untuk pelaporan.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
];