import React from 'react';

export type FeatureStat = { val: string; lbl: string };

export type Feature = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  stats: FeatureStat[];
  tags: string[];
  wide: boolean;
  video?: string;
  icon: React.ReactNode;
};

export const features: Feature[] = [
  {
    id: "01",
    tag: "Intelijen Risiko Vendor & Pihak Ketiga",
    title: "Analisis Risiko Vendor",
    desc: "Profiling otomatis untuk setiap entitas vendor. Engine ML mendeteksi indikasi vendor fiktif, anomali markup harga secara historis, dan potensi konflik kepentingan antara karyawan dengan pihak ketiga.",
    stats: [
      { val: "360°", lbl: "Visibilitas Vendor" },
      { val: "Real-time", lbl: "Deteksi Markup" },
    ],
    tags: ["profiling", "watchlist", "conflict-of-interest", "KYB"],
    wide: true,
    // Video tetap dipertahankan namun konteksnya kini untuk demo analisis vendor
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="var(--em)" strokeWidth="1.8"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: "02",
    tag: "Deteksi anomali pengadaan vendor",
    title: "AI Fraud Detection — Procurement",
    desc: "Isolation Forest mendeteksi vendor baru mencurigakan, markup harga ekstrem, relasi vendor–karyawan, dan invoice duplikat secara otomatis. Harga benchmark menggunakan referensi e-Katalog LKPP.",
    stats: [
      { val: "98%", lbl: "Deteksi vendor fiktif" },
      { val: "340%", lbl: "Markup terdeteksi tertinggi" },
    ],
    tags: ["Isolation Forest", "LKPP Benchmark", "Graph Analysis"],
    wide: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="var(--em)" strokeWidth="1.2" opacity="0.7"/>
        <path d="M14 8v6l4 2" stroke="var(--em)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="14" r="2" fill="var(--em)" opacity="0.6"/>
        <path d="M8 6L6 4M20 6l2-4M8 22l-2 2M20 22l2 2" stroke="var(--em)" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
      </svg>
    ),
  },
  {
    id: "03",
    tag: "Deteksi klaim expense manipulatif",
    title: "AI Fraud Detection — Expense",
    desc: "Identifikasi otomatis struk palsu, double claim pada periode berbeda, dan pengeluaran di luar batas wajar (outlier) per departemen menggunakan model AI yang dilatih pada pola fraud nyata di Indonesia.",
    stats: [
      { val: "97%", lbl: "Akurasi deteksi double claim" },
      { val: "< 5 dtk", lbl: "Analisis per klaim" },
    ],
    tags: ["OCR Detection", "Outlier Analysis", "Rule-based + AI"],
    wide: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="2" stroke="var(--em)" strokeWidth="1.2" opacity="0.7"/>
        <line x1="9" y1="9" x2="19" y2="9" stroke="var(--em)" strokeWidth="1" opacity="0.45"/>
        <line x1="9" y1="13" x2="16" y2="13" stroke="var(--em)" strokeWidth="1" opacity="0.45"/>
        <circle cx="18" cy="19" r="4" fill="var(--card-bg)" stroke="var(--em)" strokeWidth="1.2"/>
        <path d="M16 19l1.5 1.5L20.5 17" stroke="var(--em)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];