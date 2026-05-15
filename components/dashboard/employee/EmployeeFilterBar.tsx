import { useState } from "react";

export default function EmployeeFilterBar({ filterDept, departments, isMobile, onDeptChange }: any) {
  const [open, setOpen] = useState(false);
  const options = ["all", ...departments.filter((d: string) => d !== "all")];

  return (
    <div style={{ display: "flex", gap: "6px", background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "6px" }}>
      <div style={{ position: "relative", width: isMobile ? "100%" : "250px" }}>
        <div onClick={() => setOpen(!open)} onBlur={() => setTimeout(() => setOpen(false), 150)} tabIndex={0} style={{ padding: "9px 14px", borderRadius: "10px", border: open ? "1px solid var(--em)" : "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "13px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{filterDept === "all" ? "Semua Departemen" : filterDept}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }}><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
        </div>
        {open && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "6px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", zIndex: 100, maxHeight: "200px", overflowY: "auto", padding: "6px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            {options.map((d: string) => (
              <div key={d} onMouseDown={() => { onDeptChange(d); setOpen(false); }} style={{ padding: "8px 12px", fontSize: "12px", color: filterDept === d ? "var(--em)" : "var(--tp)", background: filterDept === d ? "var(--em-subtle)" : "transparent", borderRadius: "8px", cursor: "pointer" }}>
                {d === "all" ? "Semua Departemen" : d}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}