import { api } from "@/lib/api"; // Sesuaikan dengan path file api.ts kamu

export async function getDashboardSummary() {
  try {
    const res = await api.get("/api/dashboard/summary");
    return res as any;
  } catch (error) {
    console.error("Gagal mengambil summary dashboard:", error);
    return null;
  }
}

export async function getDashboardHighAlerts() {
  try {
    const res = await api.get("/api/dashboard/high-alerts");
    return res as any;
  } catch (error) {
    console.error("Gagal mengambil high alerts:", error);
    return [];
  }
}

export async function getDashboardLatest() {
  try {
    const res = await api.get("/api/dashboard/latest-transactions");
    return res as any;
  } catch (error) {
    console.error("Gagal mengambil transaksi terbaru:", error);
    return [];
  }
}

export async function getDashboardFraudTrend(year?: number) {
  try {
    const params = year ? `?year=${year}` : "";
    const res = await api.get(`/api/dashboard/fraud-trend${params}`);
    return res as any;
  } catch (error) {
    console.error("Gagal mengambil fraud trend:", error);
    return null;
  }
}