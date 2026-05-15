import { api } from "@/lib/api"; // Sesuaikan lokasi api.ts kamu

export async function getUsers() {
  try {
    const res = await api.get("/api/users");
    // Handle bentuk response dari backend (biasanya res.data)
    const data = (res as any).data || res;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    throw error;
  }
}

export async function createUser(data: { fullName: string; email: string; role: string }) {
  try {
    return await api.post("/api/users", data);
  } catch (error) {
    console.error("Gagal membuat user:", error);
    throw error;
  }
}

export async function updateUser(id: string, data: any) {
  try {
    return await api.put(`/api/users/${id}`, data);
  } catch (error) {
    console.error("Gagal mengupdate user:", error);
    throw error;
  }
}

export async function toggleUserStatus(id: string) {
  try {
    return await api.patch(`/api/users/${id}/toggle-active`, {});
  } catch (error) {
    console.error("Gagal mengubah status user:", error);
    throw error;
  }
}