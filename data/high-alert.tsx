export interface HighAlertItem {
  id: string;
  desc: string;
  amount: string;
  score: number;
}

export const HIGH_ALERT_ITEMS: HighAlertItem[] = [
  { id: "TRX-0036", desc: "Duplicate invoice - Alat Tulis", amount: "Rp 3.750.000", score: 91 },
  { id: "TRX-0041", desc: "Entertainment - Dinner Sate Khas", amount: "Rp 4.200.000", score: 82 },
  { id: "TRX-0040", desc: "Pengadaan ATK - CV Maju Bersama", amount: "Rp 18.500.000", score: 74 },
  { id: "TRX-0029", desc: "Vendor baru - PT Cepat Untung", amount: "Rp 55.000.000", score: 88 },
  { id: "TRX-0021", desc: "Self approval - Jasa Konsultasi", amount: "Rp 32.000.000", score: 77 },
];

export const HIGH_ALERT_TOTAL = 43;