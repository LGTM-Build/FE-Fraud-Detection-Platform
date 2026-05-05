import { api } from "@/lib/api"; // Sesuaikan path ini dengan lokasi file api.ts kamu
import type { ProcurementTransaction } from "@/data/procurement";

// Fungsi GET Data
// Fungsi GET Data
export async function getTransactions(): Promise<ProcurementTransaction[]> {
  try {
    const res = await api.get<any>("/api/procurement-monitor");
    
    // PENYELESAIAN ERROR 'never': 
    // Paksa TypeScript menganggap 'res' sebagai tipe 'any' terlebih dahulu, 
    // baru kemudian kita periksa apakah dia punya properti 'data' atau tidak.
    const responseData = res as any;

    if (Array.isArray(responseData)) {
      return responseData;
    } else if (responseData && Array.isArray(responseData.data)) {
      return responseData.data;
    } else if (responseData && Array.isArray(responseData.items)) {
      return responseData.items;
    }
    
    // Kalau respon sukses tapi bukan array, kembalikan array kosong agar tabel tidak crash
    return []; 
    
  } catch (error) {
    console.error("Gagal mengambil data pengadaan:", error);
    throw new Error("Gagal memuat data");
  }
}

// Fungsi POST / Tambah Data
export async function createTransaction(data: any) {
  try {
    // Sesuaikan dengan route: router.post("/api/procurements")
    const res = await api.post("/api/procurements", data);
    return res;
  } catch (error) {
    console.error("Gagal menyimpan data pengadaan:", error);
    throw new Error("Gagal menyimpan data");
  }
}

// Fungsi UPDATE Status (Approve/Reject)
export async function updateTransactionStatus(id: string, status: string) {
  try {
    // Sesuaikan dengan route: router.post("/api/procurement-monitor/:id/review")
    // Perhatikan ini pakai POST, bukan PATCH sesuai dengan router kamu
    const res = await api.post(`/api/procurement-monitor/${id}/review`, { status });
    return res;
  } catch (error) {
    console.error("Gagal mengubah status transaksi:", error);
    throw new Error("Gagal memperbarui status");
  }
}