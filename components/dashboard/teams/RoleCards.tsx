"use client";

interface RoleCardsProps {
  members: any[];
}

export default function RoleCards({ members }: RoleCardsProps) {
  // Hitung jumlah user per role
  const counts = {
    admin: members.filter(m => m.role === "super_admin" || m.role === "super_user").length,
    auditor: members.filter(m => m.role === "auditor").length,
    operator: members.filter(m => m.role === "operator").length,
    deptHead: members.filter(m => m.role === "department_head").length,
  };

  const roleData = [
    {
      id: "admin",
      label: "Admin",
      count: counts.admin,
      bg: "rgba(239,68,68,0.08)", color: "#dc2626", border: "rgba(239,68,68,0.25)",
      perms: [
        "Upload CSV",
        "Manage users",
        "Edit policy",
        "Generate report",
        "Review transaksi",
        "Lihat semua data"
      ]
    },
    {
      id: "auditor",
      label: "Auditor",
      count: counts.auditor,
      bg: "var(--em-subtle)", color: "var(--em)", border: "rgba(16,185,129,0.25)",
      perms: [
        "Review transaksi",
        "Approve / Reject / Eskalasi",
        "Generate report",
        "Lihat semua data"
      ]
    },
    {
      id: "operator",
      label: "Operator",
      count: counts.operator,
      bg: "rgba(245,158,11,0.08)", color: "#d97706", border: "rgba(245,158,11,0.25)",
      perms: [
        "Upload CSV",
        "Manage import transaksi",
        "Lihat data expense",
        "Lihat data procurement"
      ]
    },
    {
      id: "dept_head",
      label: "Dept Head",
      count: counts.deptHead,
      bg: "rgba(99,102,241,0.08)", color: "#6366f1", border: "rgba(99,102,241,0.25)",
      perms: [
        "Lihat dashboard",
        "Lihat laporan (read-only)"
      ]
    }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "16px"
    }}>
      {roleData.map((role) => (
        <div key={role.id} style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-b)",
          borderRadius: "16px",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          {/* Header Card: Badge Role & Total Pengguna */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              padding: "4px 14px",
              borderRadius: "100px",
              background: role.bg,
              color: role.color,
              border: `1px solid ${role.border}`,
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif"
            }}>
              {role.label}
            </span>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>
              {role.count} pengguna
            </span>
          </div>

          {/* List Permissions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {role.perms.map((perm, idx) => (
              <div key={idx} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "13px",
                color: "var(--ts)",
                lineHeight: 1.4
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {perm}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}