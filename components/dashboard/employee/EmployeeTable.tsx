import { useState } from "react";
import { TABLE_COL_HEADERS, fmtDate, type Employee } from "@/data/employees";

export default function EmployeeTable({ data, onSelect, isMobile }: { data: Employee[], onSelect: (e: Employee) => void, isMobile: boolean }) {
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();
  const filtered = q ? data.filter(e => e.fullName.toLowerCase().includes(q) || (e.department ?? "").toLowerCase().includes(q)) : data;

  return (
    <>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau departemen..." style={{ flex: 1, border: "none", background: "transparent", fontSize: "13px", color: "var(--tp)", outline: "none" }} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
              {TABLE_COL_HEADERS.map(h => <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} onClick={() => onSelect(e)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                <td style={{ padding: "13px 16px", fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{e.fullName}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "var(--ts)" }}>{e.position ?? "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "var(--ts)" }}>{e.department ?? "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: "13px", color: "var(--ts)" }}>{e.phoneNumber ?? "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: "12px", color: "var(--tm)" }}>{e.externalRef ?? "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: "12px", color: "var(--tm)" }}>{fmtDate(e.createdAt)}</td>
                <td style={{ padding: "13px 16px" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}