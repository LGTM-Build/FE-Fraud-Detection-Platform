import { api } from "@/lib/api";

export async function getVendors() {
  try {
    const res = await api.get<any>("/api/vendors");
    const data = (res as any).data || res;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal mengambil data vendor:", error);
    throw error;
  }
}

export async function getVendorDetail(id: string) {
  try {
    const res = await api.get<any>(`/api/vendors/${id}`);
    return (res as any).data || res;
  } catch (error) {
    console.error("Gagal mengambil detail vendor:", error);
    throw error;
  }
}

export async function createVendor(data: {
  vendorName: string;
  status?: "active" | "inactive" | "blacklisted";
  metadata?: unknown;
}) {
  try {
    const res = await api.post<any>("/api/vendors", data);
    return (res as any).data || res;
  } catch (error) {
    console.error("Gagal membuat vendor:", error);
    throw error;
  }
}

export async function updateVendor(id: string, data: {
  vendorName?: string;
  status?: "active" | "inactive" | "blacklisted";
  metadata?: unknown;
}) {
  try {
    const res = await api.put<any>(`/api/vendors/${id}`, data);
    return (res as any).data || res;
  } catch (error) {
    console.error("Gagal update vendor:", error);
    throw error;
  }
}

export async function updateVendorStatus(id: string, status: "active" | "inactive" | "blacklisted") {
  try {
    const res = await api.patch<any>(`/api/vendors/${id}/status`, { status });
    return (res as any).data || res;
  } catch (error) {
    console.error("Gagal update status vendor:", error);
    throw error;
  }
}