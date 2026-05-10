import { api } from "@/lib/api";

export async function getEmployees() {
  try {
    // Tambahkan <any> agar TypeScript tahu tipe data balikan dari API
    const res = await api.get<any>("/api/employees");
    return res.data; 
  } catch (error) {
    console.error("Gagal mengambil data karyawan:", error);
    throw error;
  }
}

export async function getEmployeeDetail(id: string) {
  try {
    const res = await api.get<any>(`/api/employees/${id}`);
    return res.data;
  } catch (error) {
    console.error("Gagal mengambil detail karyawan:", error);
    throw error;
  }
}

export async function createEmployee(data: {
  fullName: string;
  phoneNumber: string;
  department?: string;
  position?: string;
  avgMonthlyExpense?: number;
  externalRef?: string;
}) {
  try {
    // Tambahkan <any> pada method POST
    const res = await api.post<any>("/api/employees", data);
    return res.data;
  } catch (error) {
    console.error("Gagal membuat data karyawan:", error);
    throw error;
  }
}

export async function updateEmployee(id: string, data: any) {
  try {
    // Tambahkan <any> pada method PATCH
    const res = await api.patch<any>(`/api/employees/${id}`, data); 
    return res.data;
  } catch (error) {
    console.error("Gagal update data karyawan:", error);
    throw error;
  }
}