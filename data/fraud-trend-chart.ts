export type Range = "weekly" | "monthly";

export type ChartDataPoint = {
  period: string;
  expense: number;
  procurement: number;
};

export const dataMonthly: ChartDataPoint[] = [
  { period: "Jan", expense: 18, procurement: 9 },
  { period: "Feb", expense: 24, procurement: 14 },
  { period: "Mar", expense: 21, procurement: 11 },
  { period: "Apr", expense: 34, procurement: 19 },
  { period: "Mei", expense: 28, procurement: 22 },
  { period: "Jun", expense: 41, procurement: 17 },
  { period: "Jul", expense: 38, procurement: 25 },
  { period: "Agu", expense: 52, procurement: 31 },
  { period: "Sep", expense: 47, procurement: 28 },
  { period: "Okt", expense: 43, procurement: 24 },
  { period: "Nov", expense: 58, procurement: 35 },
  { period: "Des", expense: 61, procurement: 40 },
];

export const dataWeekly: ChartDataPoint[] = [
  { period: "Sen", expense: 8,  procurement: 3 },
  { period: "Sel", expense: 14, procurement: 7 },
  { period: "Rab", expense: 11, procurement: 5 },
  { period: "Kam", expense: 19, procurement: 9 },
  { period: "Jum", expense: 16, procurement: 12 },
  { period: "Sab", expense: 6,  procurement: 2 },
  { period: "Min", expense: 4,  procurement: 1 },
];

export const chartLegend = [
  { key: "expense",     label: "Expense",     color: "#10b981" },
  { key: "procurement", label: "Procurement", color: "#6ee7b7" },
];