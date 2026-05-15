import { api } from "@/lib/api"; 
import type { ExpenseTransaction } from "@/data/expenses";

export async function getExpenses(): Promise<ExpenseTransaction[]> {
  try {
    // 1. Kasih tipe eksplisit : any biar TypeScript ga protes
    const res: any = await api.get("/api/expense-monitor");
    
    // 2. Ambil payload-nya (karena kadang Axios nyimpen di .data, kadang custom fetch langsung return json)
    const json = res.data ?? res;

    // 3. Ekstrak datanya!
    // Skenario A: Backend bungkus lagi pakai { data: [...] }
    if (json && Array.isArray(json.data)) {
      return json.data;
    }
    
    // Skenario B: Ternyata json itu sendiri udah langsung berbentuk Array
    if (Array.isArray(json)) {
      return json;
    }
    
    // Kalau ngga masuk skenario manapun, return array kosong
    return [];
  } catch (error) {
    console.error("Gagal mengambil data pengeluaran:", error);
    throw new Error("Gagal memuat data");
  }
}

export async function createExpense(data: any) {
  try {
    const res: any = await api.post("/api/expenses", data);
    return res.data ?? res;
  } catch (error) {
    console.error("Gagal menyimpan data pengeluaran:", error);
    throw new Error("Gagal menyimpan data");
  }
}

export async function updateExpenseStatus(id: string, status: string) {
  try {
    const res: any = await api.post(`/api/expense-monitor/${id}/review`, { status });
    return res.data ?? res;
  } catch (error) {
    console.error("Gagal mengubah status transaksi:", error);
    throw new Error("Gagal mengubah status");
  }
}