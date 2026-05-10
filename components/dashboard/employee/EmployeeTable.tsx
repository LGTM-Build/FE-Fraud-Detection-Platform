import { useState } from "react";

// Header Tabel Hardcode biar aman dari import error
const TABLE_COL_HEADERS = ["Nama Karyawan", "Posisi", "Departemen", "No. Telepon", "Ref ID", "Rata-rata Expense", ""];

export default function EmployeeTable({ data, onSelect, isMobile }: { data: any[], onSelect: (e: any) => void, isMobile: boolean }) {
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();
  
  // Fitur Filter Search
  const filtered = q ? data.filter(e => 
    e.fullName?.toLowerCase().includes(q) || 
    (e.department ?? "").toLowerCase().includes(q)
  ) : data;

  // Fitur Format Mata Uang
  const formatRupiah = (angka: number | string | null | undefined) => {
    if (angka === null || angka === undefined || angka === "") return "—";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(angka));
  };

  return (
    <>
      {/* Search Bar */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau departemen..." style={{ flex: 1, border: "none", background: "transparent", fontSize: "13px", color: "var(--tp)", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
      </div>

      {/* Area Table Scroll */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
              {TABLE_COL_HEADERS.map(h => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} onClick={() => onSelect(e)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={ev => (ev.currentTarget as HTMLElement).style.background = "var(--em-subtle)"} onMouseLeave={ev => (ev.currentTarget as HTMLElement).style.background = "transparent"}>
                
                {/* Nama Lengkap */}
                <td style={{ padding: "13px 16px", fontSize: "13px", fontWeight: 600, color: "var(--tp)", whiteSpace: "nowrap" }}>
                  {e.fullName}
                </td>
                
                {/* Posisi & Departemen */}
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "var(--ts)", whiteSpace: "nowrap" }}>{e.position ?? "—"}</td>
                <td style={{ padding: "13px 16px" }}>
                   <span style={{ padding: "3px 10px", borderRadius: "100px", background: "var(--surface-2)", color: "var(--ts)", border: "1px solid var(--border)", fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap" }}>
                     {e.department ?? "—"}
                   </span>
                </td>

                {/* Info Tambahan */}
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "var(--ts)", whiteSpace: "nowrap" }}>{e.phoneNumber ?? "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: "12px", color: "var(--tm)", fontFamily: "'DM Sans', monospace" }}>{e.externalRef ?? "—"}</td>
                
                {/* Format Rupiah untuk Limit/Avg Expense */}
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "var(--tp)", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {formatRupiah(e.avgMonthlyExpense)}
                </td>

                {/* Icon Action (Arrow) */}
                <td style={{ padding: "13px 16px", textAlign: "right" }}>
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}