import { api } from "@/lib/api"; // Sesuaikan dengan lokasi api.ts kamu

export async function getEmployees() {
  try {
    const res = await api.get<any>("/api/employees");
    const responseData = res as any;
    if (Array.isArray(responseData)) return responseData;
    if (responseData && Array.isArray(responseData.data)) return responseData.data;
    if (responseData && Array.isArray(responseData.items)) return responseData.items;
    return [];
  } catch (error) {
    console.error("Gagal mengambil data karyawan:", error);
    throw new Error("Gagal memuat data");
  }
}

export async function createEmployee(data: any) {
  try {
    return await api.post("/api/employees", data);
  } catch (error) {
    console.error("Gagal menambah karyawan:", error);
    throw new Error("Gagal menyimpan data");
  }
}

export async function updateEmployee(id: string, data: any) {
  try {
    return await api.put(`/api/employees/${id}`, data);
  } catch (error) {
    console.error("Gagal mengupdate karyawan:", error);
    throw new Error("Gagal mengupdate data");
  }
}