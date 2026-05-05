import { api } from "@/lib/api"; // Sesuaikan path ini
import type { ExpenseTransaction } from "@/data/expenses";

export async function getExpenses(): Promise<ExpenseTransaction[]> {
  try {
    const res = await api.get<any>("/api/expense-monitor");
    const responseData = res as any;

    if (Array.isArray(responseData)) return responseData;
    if (responseData && Array.isArray(responseData.data)) return responseData.data;
    if (responseData && Array.isArray(responseData.items)) return responseData.items;
    
    return [];
  } catch (error) {
    console.error("Gagal mengambil data pengeluaran:", error);
    throw new Error("Gagal memuat data");
  }
}

export async function createExpense(data: any) {
  try {
    // Menembak ke endpoint router.post("/api/expenses")
    return await api.post("/api/expenses", data);
  } catch (error) {
    console.error("Gagal menyimpan data pengeluaran:", error);
    throw new Error("Gagal menyimpan data");
  }
}

export async function updateExpenseStatus(id: string, status: string) {
  try {
    // Menembak ke endpoint router.post("/api/expense-monitor/:id/review")
    return await api.post(`/api/expense-monitor/${id}/review`, { status });
  } catch (error) {
    console.error("Gagal mengubah status transaksi:", error);
    throw new Error("Gagal memperbarui status");
  }
}