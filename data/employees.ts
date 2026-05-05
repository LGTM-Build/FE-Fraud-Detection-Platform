export interface Employee {
  id: string;
  fullName: string;
  phoneNumber: string;
  department: string | null;
  position: string | null;
  externalRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export const TABLE_COL_HEADERS = [
  "Nama Karyawan", "Posisi", "Departemen", "No. Telepon", "Ref ID", "Bergabung Pada", ""
];

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });