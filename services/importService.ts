import { apiFetch } from "@/lib/api";

// importService.ts
export async function importExpenses(file: File, dispatchMl: boolean) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiFetch(`/api/imports/expenses?dispatchMl=${dispatchMl}`, {
    method: "POST",
    body: formData,
  });
  
  return result;
}

export async function importProcurements(file: File, dispatchMl: boolean) {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch(`/api/imports/procurements?dispatchMl=${dispatchMl}`, {
    method: "POST",
    body: formData,
  });
}