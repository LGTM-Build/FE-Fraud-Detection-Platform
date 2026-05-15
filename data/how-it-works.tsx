import { ReactNode } from "react";

export interface Step {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  detail: string;
  icon: ReactNode;
}

export const steps: Step[] = [
  {
    num: "01",
    title: "Upload CSV atau Form",
    subtitle: "Input data fleksibel",
    desc: "Upload file CSV transaksi Anda atau isi data secara manual melalui form. Fradara menerima data expense, procurement, dan data vendor tanpa ribet.",
    detail: "Mendukung encoding UTF-8 dan berbagai format tanggal standar Indonesia.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Mapping Data Otomatis",
    subtitle: "Integrasi ke sistem",
    desc: "Sistem langsung mendeteksi kolom penting seperti nominal, tanggal, dan nama vendor. Anda cukup melakukan konfirmasi mapping data ke backend kami.",
    detail: "Proses mapping cepat untuk memastikan data siap diolah oleh engine AI.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M16.24 7.76a6 6 0 010 8.49M7.76 7.76a6 6 0 000 8.49"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "AI Analisis Fraud",
    subtitle: "Machine Learning bekerja",
    desc: "Engine AI melakukan scoring pada setiap transaksi dan profil vendor. Mendeteksi indikasi markup, vendor fiktif, hingga double claim secara otomatis.",
    detail: "Algoritma ML memberikan Fraud Score 0-100 untuk setiap temuan.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Review Hasil Audit",
    subtitle: "Dashboard Auditor",
    desc: "Periksa hasil deteksi melalui dashboard. Anda bisa menyetujui, menolak, atau memberikan catatan pada transaksi yang dianggap mencurigakan.",
    detail: "Semua aksi audit tercatat secara aman dalam sistem (audit trail).",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
];