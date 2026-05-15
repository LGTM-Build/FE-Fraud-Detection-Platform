import { api, apiFetch } from "@/lib/api";
import type { ProcurementTransaction } from "@/data/procurement";

export async function getTransactions(): Promise<ProcurementTransaction[]> {
  try {
    const res = await api.get<any>("/api/procurement-monitor");
    const responseData = res as any;

    if (Array.isArray(responseData)) return responseData;
    if (responseData && Array.isArray(responseData.data)) return responseData.data;
    if (responseData && Array.isArray(responseData.items)) return responseData.items;

    return [];
  } catch (error) {
    console.error("Gagal mengambil data pengadaan:", error);
    throw new Error("Gagal memuat data");
  }
}

export async function createTransaction(data: any) {
  try {
    return await api.post("/api/procurements", data);
  } catch (error) {
    console.error("Gagal menyimpan data pengadaan:", error);
    throw new Error("Gagal menyimpan data");
  }
}

// Fix: pakai PATCH sesuai route /api/procurements/:id/review
export async function updateTransactionStatus(id: string, status: string) {
  try {
    return await api.patch(`/api/procurements/${id}/review`, { status });
  } catch (error) {
    console.error("Gagal mengubah status transaksi:", error);
    throw new Error("Gagal memperbarui status");
  }
}

export async function importProcurements(file: File, dispatchMl: boolean) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(`/api/imports/procurements?dispatchMl=${dispatchMl}`, {
    method: "POST",
    body: formData,
  });
}