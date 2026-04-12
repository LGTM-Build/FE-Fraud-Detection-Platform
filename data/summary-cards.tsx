export type Trend = "up" | "down" | "neutral";

export type SummaryCard = {
  label: string;
  value: string;
  sub: string;
  trend: Trend;
  trendVal: string;
  icon: React.ReactNode;
  accent?: "danger" | "warning" | "success" | "default";
};

export const cards: SummaryCard[] = [
  {
    label: "Total Transaksi",
    value: "3.842",
    sub: "bulan ini",
    trend: "up",
    trendVal: "+124 dari bulan lalu",
    accent: "default",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: "Perlu Review",
    value: "217",
    sub: "fraud score 30–70",
    trend: "up",
    trendVal: "+38 dari minggu lalu",
    accent: "warning",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  {
    label: "High Alert",
    value: "43",
    sub: "fraud score > 70",
    trend: "down",
    trendVal: "−7 dari minggu lalu",
    accent: "danger",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    label: "Nilai Berisiko",
    value: "Rp 2,4M",
    sub: "estimasi total exposure",
    trend: "down",
    trendVal: "−Rp 340rb dari bulan lalu",
    accent: "success",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
];