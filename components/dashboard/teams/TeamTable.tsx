"use client";
import { useState } from "react";

const roleConfig: Record<string, any> = {
  super_admin:     { label: "Super Admin",     bg: "rgba(239,68,68,0.08)",   color: "#dc2626", border: "rgba(239,68,68,0.20)" },
  super_user:      { label: "Super User",      bg: "rgba(239,68,68,0.08)",   color: "#dc2626", border: "rgba(239,68,68,0.20)" },
  auditor:         { label: "Auditor",         bg: "var(--em-subtle)",       color: "var(--em)", border: "rgba(16,185,129,0.20)" },
  operator:        { label: "Operator",        bg: "rgba(245,158,11,0.08)",  color: "#d97706", border: "rgba(245,158,11,0.20)" },
  department_head: { label: "Dept Head",       bg: "rgba(99,102,241,0.08)",  color: "#6366f1", border: "rgba(99,102,241,0.20)" },
};

export default function TeamTable({ members, onEdit, onToggleStatus }: { members: any[], onEdit: (m: any) => void, onToggleStatus: (id: string) => void }) {
  const [filterRole, setFilterRole] = useState("all");

  const filtered = members.filter(m => filterRole === "all" || m.role === filterRole);
  const getDerivedStatus = (m: any) => m.isActive !== false ? "active" : "inactive";

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>Daftar Member</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>{filtered.length} dari {members.length} member</p>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "3px", overflowX: "auto" }}>
          {["all", "auditor", "operator", "department_head"].map(key => (
            <button key={key} onClick={() => setFilterRole(key)} style={{
              padding: "5px 12px", borderRadius: "8px", border: "none", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontWeight: filterRole === key ? 500 : 400, whiteSpace: "nowrap",
              background: filterRole === key ? "var(--em-subtle-2)" : "transparent",
              color: filterRole === key ? "var(--em)" : "var(--tm)",
            }}>
              {key === "all" ? "Semua" : roleConfig[key]?.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {/* Kolom Departemen dihapus */}
              {["Member", "Role", "Bergabung", "Status", ""].map(h => <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--tm)", fontSize: "13px" }}>Belum ada member.</td></tr> : filtered.map((member, i) => {
              const rc = roleConfig[member.role] || { label: member.role, bg: "var(--surface-2)", color: "var(--ts)", border: "var(--border)" };
              const derivedStatus = getDerivedStatus(member);
              const isLast = i === filtered.length - 1;

              return (
                <tr key={member.id} style={{ borderBottom: isLast ? "none" : "1px solid var(--border)", transition: "background 0.15s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, var(--em), var(--em2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {member.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", whiteSpace: "nowrap" }}>{member.fullName}</div>
                        <div style={{ fontSize: "11px", color: "var(--tm)" }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}><span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, whiteSpace: "nowrap" }}>{rc.label}</span></td>
                  <td style={{ padding: "13px 16px" }}><span style={{ fontSize: "12px", color: "var(--tm)", whiteSpace: "nowrap" }}>{member.createdAt ? new Date(member.createdAt).toLocaleDateString('id-ID') : "—"}</span></td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: derivedStatus === "active" ? "#10b981" : "var(--tm)", flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: derivedStatus === "active" ? "var(--em)" : "var(--tm)", fontWeight: 500 }}>{derivedStatus === "active" ? "Aktif" : "Nonaktif"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => onEdit(member)} style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                      {derivedStatus === "active" && <button onClick={() => onToggleStatus(member.id)} style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", fontSize: "11px", color: "#dc2626", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Nonaktifkan</button>}
                      {derivedStatus === "inactive" && <button onClick={() => onToggleStatus(member.id)} style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)", fontSize: "11px", color: "var(--em)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Aktifkan</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}