export type Tab = "users" | "policy" | "notifications" | "integrations";
export type UserRole = "admin" | "auditor" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastActive: string;
  status: "active" | "inactive";
}

export interface PolicyRule {
  id: string;
  category: string;
  grade: string;
  limitPerClaim: number;
  limitPerMonth: number;
  requireReceipt: boolean;
  requireApproval: boolean;
}

export const users: User[] = [
  { id: "USR-001", name: "Dewi Rahayu",   email: "dewi@company.id",  role: "admin",   department: "Finance",       lastActive: "Hari ini, 09:14", status: "active" },
  { id: "USR-002", name: "Rina Kusuma",   email: "rina@company.id",  role: "auditor", department: "Internal Audit",lastActive: "Hari ini, 08:45", status: "active" },
  { id: "USR-003", name: "Anton Susilo",  email: "anton@company.id", role: "auditor", department: "Procurement",   lastActive: "Kemarin, 16:30",  status: "active" },
  { id: "USR-004", name: "Fajar Nugroho", email: "fajar@company.id", role: "viewer",  department: "IT",            lastActive: "3 hari lalu",     status: "active" },
  { id: "USR-005", name: "Laila Sari",    email: "laila@company.id", role: "viewer",  department: "HR",            lastActive: "1 minggu lalu",   status: "inactive" },
];

export const roleConfig: Record<UserRole, { label: string; bg: string; color: string; border: string }> = {
  admin:   { label: "Admin",   bg: "rgba(239,68,68,0.08)", color: "#dc2626",    border: "rgba(239,68,68,0.18)" },
  auditor: { label: "Auditor", bg: "var(--em-subtle)",     color: "var(--em)",  border: "rgba(16,185,129,0.20)" },
  viewer:  { label: "Viewer",  bg: "var(--surface-2)",     color: "var(--tm)",  border: "var(--border)" },
};

export const rolePerms: Record<UserRole, string[]> = {
  admin:   ["Upload CSV", "Manage users", "Edit policy", "Generate report", "Review transaksi", "Lihat semua data"],
  auditor: ["Review transaksi", "Approve / Reject / Eskalasi", "Generate report", "Lihat semua data"],
  viewer:  ["Lihat dashboard", "Lihat laporan (read-only)"],
};

export const policyRules: PolicyRule[] = [
  { id: "POL-01", category: "Entertainment", grade: "Staff",    limitPerClaim: 500000,   limitPerMonth: 1500000,  requireReceipt: true,  requireApproval: true },
  { id: "POL-02", category: "Entertainment", grade: "Manager",  limitPerClaim: 2000000,  limitPerMonth: 6000000,  requireReceipt: true,  requireApproval: true },
  { id: "POL-03", category: "Entertainment", grade: "Director", limitPerClaim: 10000000, limitPerMonth: 30000000, requireReceipt: true,  requireApproval: true },
  { id: "POL-04", category: "Transport",     grade: "Staff",    limitPerClaim: 300000,   limitPerMonth: 900000,   requireReceipt: false, requireApproval: false },
  { id: "POL-05", category: "Transport",     grade: "Manager",  limitPerClaim: 750000,   limitPerMonth: 2250000,  requireReceipt: false, requireApproval: false },
  { id: "POL-06", category: "Meals",         grade: "Staff",    limitPerClaim: 150000,   limitPerMonth: 600000,   requireReceipt: false, requireApproval: false },
  { id: "POL-07", category: "Meals",         grade: "Manager",  limitPerClaim: 300000,   limitPerMonth: 1200000,  requireReceipt: false, requireApproval: false },
  { id: "POL-08", category: "Training",      grade: "All",      limitPerClaim: 5000000,  limitPerMonth: 10000000, requireReceipt: true,  requireApproval: true },
];

export function fmt(n: number) {
  if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(0) + "jt";
  return "Rp " + (n / 1000).toFixed(0) + "rb";
}

export const TABS: { key: Tab; label: string }[] = [
  { key: "users",         label: "Pengguna & Peran" },
  { key: "policy",        label: "Policy Rules" },
  { key: "notifications", label: "Notifikasi" },
  { key: "integrations",  label: "Integrasi API" },
];