import type { Employee } from "@/data/employees";

export default function EmployeeSummaryCards({ data, isMobile }: { data: Employee[], isMobile?: boolean, isTablet?: boolean }) {
  const departments = new Set(data.map(e => e.department).filter(Boolean)).size;
  const newThisMonth = data.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length;

  const cards = [
    { label: "Total Karyawan", value: String(data.length), sub: "keseluruhan data" },
    { label: "Departemen Aktif", value: String(departments), sub: "divisi terdaftar" },
    { label: "Karyawan Baru", value: String(newThisMonth), sub: "bergabung bulan ini" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "16px" }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--ts)" }}>{c.label}</span>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--tp)", lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}