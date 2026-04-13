"use client";
import { useState } from "react";

type Role = "AUDITOR" | "OPERATOR" | "DEPARTMENT_HEAD";
type MemberStatus = "active" | "inactive" | "pending";

interface Member {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  department: string;
  status: MemberStatus;
  joinedAt: string;
  lastActive: string;
}

const members: Member[] = [
  { id: "USR-002", fullName: "Rina Kusuma",   email: "rina@company.id",   role: "AUDITOR",         department: "Internal Audit", status: "active",  joinedAt: "1 Jan 2026",  lastActive: "Hari ini, 08:45" },
  { id: "USR-003", fullName: "Anton Susilo",  email: "anton@company.id",  role: "AUDITOR",         department: "Procurement",    status: "active",  joinedAt: "1 Jan 2026",  lastActive: "Kemarin, 16:30" },
  { id: "USR-004", fullName: "Fajar Nugroho", email: "fajar@company.id",  role: "OPERATOR",        department: "IT",             status: "active",  joinedAt: "15 Feb 2026", lastActive: "3 hari lalu" },
  { id: "USR-005", fullName: "Laila Sari",    email: "laila@company.id",  role: "OPERATOR",        department: "HR",             status: "inactive", joinedAt: "15 Feb 2026", lastActive: "1 minggu lalu" },
  { id: "USR-006", fullName: "Budi Hartono",  email: "budi@company.id",   role: "DEPARTMENT_HEAD", department: "Sales",          status: "pending",  joinedAt: "10 Apr 2026", lastActive: "—" },
];

const roleConfig: Record<Role, { label: string; bg: string; color: string; border: string }> = {
  AUDITOR:         { label: "Auditor",         bg: "var(--em-subtle)",       color: "var(--em)",  border: "rgba(16,185,129,0.20)" },
  OPERATOR:        { label: "Operator",        bg: "rgba(245,158,11,0.08)",  color: "#d97706",    border: "rgba(245,158,11,0.20)" },
  DEPARTMENT_HEAD: { label: "Dept Head",       bg: "rgba(99,102,241,0.08)", color: "#6366f1",    border: "rgba(99,102,241,0.20)" },
};

const statusConfig: Record<MemberStatus, { label: string; dot: string; color: string }> = {
  active:   { label: "Aktif",    dot: "#10b981", color: "var(--em)" },
  inactive: { label: "Nonaktif", dot: "var(--tm)", color: "var(--tm)" },
  pending:  { label: "Menunggu", dot: "#f59e0b", color: "#d97706" },
};

const rolePerms: Record<Role, string[]> = {
  AUDITOR:         ["Review & approve/reject transaksi", "Lihat semua data", "Generate report"],
  OPERATOR:        ["Upload CSV & manage import", "Lihat data expense & procurement (read-only)"],
  DEPARTMENT_HEAD: ["Lihat data departemen sendiri (read-only)", "Generate report (dept only)"],
};

type ModalMode = "invite" | "edit" | null;

export default function TeamManagementPage() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [filterRole, setFilterRole] = useState<Role | "all">("all");

  // Invite form state
  const [inviteForm, setInviteForm] = useState({ fullName: "", email: "", role: "AUDITOR" as Role, department: "" });

  const filtered = members.filter(m => filterRole === "all" || m.role === filterRole);

  const counts = {
    all: members.length,
    AUDITOR: members.filter(m => m.role === "AUDITOR").length,
    OPERATOR: members.filter(m => m.role === "OPERATOR").length,
    DEPARTMENT_HEAD: members.filter(m => m.role === "DEPARTMENT_HEAD").length,
  };

  const openEdit = (member: Member) => {
    setSelectedMember(member);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedMember(null);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
              Team Management
            </h1>
            <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
              Kelola anggota tim dan hak akses mereka
            </p>
          </div>
          <button
            onClick={() => setModalMode("invite")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "9px 18px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, var(--em), var(--em2))",
              color: "#fff", fontSize: "13px", fontWeight: 500,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
              flexShrink: 0,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Undang Member
          </button>
        </div>

        {/* Role permission cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {(["AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"] as Role[]).map(role => {
            const rc = roleConfig[role];
            return (
              <div key={role} style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                    {rc.label}
                  </span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 800, color: "var(--tp)" }}>
                    {counts[role]}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {rolePerms[role].map(p => (
                    <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "11px", color: "var(--ts)", lineHeight: 1.4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter + table */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>

          {/* Table header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>
                Daftar Member
              </h3>
              <p style={{ fontSize: "12px", color: "var(--tm)" }}>{filtered.length} dari {members.length} member</p>
            </div>

            {/* Role filter tabs */}
            <div style={{ display: "flex", gap: "4px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "3px" }}>
              {([
                { key: "all",            label: "Semua" },
                { key: "AUDITOR",        label: "Auditor" },
                { key: "OPERATOR",       label: "Operator" },
                { key: "DEPARTMENT_HEAD",label: "Dept Head" },
              ] as { key: Role | "all"; label: string }[]).map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterRole(f.key)}
                  style={{
                    padding: "5px 12px", borderRadius: "8px", border: "none",
                    fontSize: "12px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: filterRole === f.key ? 500 : 400,
                    transition: "all 0.15s",
                    background: filterRole === f.key ? "var(--em-subtle-2)" : "transparent",
                    color: filterRole === f.key ? "var(--em)" : "var(--tm)",
                  }}
                >
                  {f.label}
                  {" "}
                  <span style={{ fontSize: "10px", opacity: 0.7 }}>
                    {counts[f.key as keyof typeof counts]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Member", "Departemen", "Role", "Bergabung", "Terakhir Aktif", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, i) => {
                const rc = roleConfig[member.role];
                const sc = statusConfig[member.status];
                const isLast = i === filtered.length - 1;
                return (
                  <tr
                    key={member.id}
                    style={{ borderBottom: isLast ? "none" : "1px solid var(--border)", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    {/* Member */}
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          background: member.status === "pending"
                            ? "var(--surface-2)"
                            : "linear-gradient(135deg, var(--em), var(--em2))",
                          border: member.status === "pending" ? "1px dashed var(--border)" : "none",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 700,
                          color: member.status === "pending" ? "var(--tm)" : "#fff",
                          flexShrink: 0,
                        }}>
                          {member.status === "pending"
                            ? "?"
                            : member.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)
                          }
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{member.fullName}</div>
                          <div style={{ fontSize: "11px", color: "var(--tm)" }}>{member.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--ts)" }}>{member.department}</span>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                        {rc.label}
                      </span>
                    </td>

                    {/* Joined */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{member.joinedAt}</span>
                    </td>

                    {/* Last active */}
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{member.lastActive}</span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: "12px", color: sc.color, fontWeight: 500 }}>{sc.label}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => openEdit(member)}
                          style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
                          onMouseEnter={e => { (e.currentTarget).style.borderColor = "var(--em)"; (e.currentTarget).style.color = "var(--em)"; }}
                          onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--ts)"; }}
                        >
                          Edit
                        </button>
                        {member.status === "active" && (
                          <button
                            style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", fontSize: "11px", color: "#dc2626", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Nonaktifkan
                          </button>
                        )}
                        {member.status === "inactive" && (
                          <button
                            style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.06)", fontSize: "11px", color: "var(--em)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Aktifkan
                          </button>
                        )}
                        {member.status === "pending" && (
                          <button
                            style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.06)", fontSize: "11px", color: "#d97706", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Kirim Ulang
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Invite ── */}
      {modalMode === "invite" && (
        <>
          <div onClick={closeModal} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 201, width: "440px",
            background: "var(--bg)", borderRadius: "20px",
            border: "1px solid var(--border)",
            padding: "28px", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            display: "flex", flexDirection: "column", gap: "18px",
          }}>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", marginBottom: "4px" }}>
                Undang Member Baru
              </h3>
              <p style={{ fontSize: "12px", color: "var(--tm)" }}>
                Sistem akan mengirim kredensial sementara ke email member
              </p>
            </div>

            {/* Form fields */}
            {[
              { label: "Nama Lengkap", key: "fullName", type: "text", placeholder: "Nama lengkap member" },
              { label: "Email",        key: "email",    type: "email", placeholder: "email@perusahaan.com" },
              { label: "Departemen",   key: "department", type: "text", placeholder: "Contoh: Finance, IT, HR" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px", fontWeight: 500 }}>{f.label}</div>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={inviteForm[f.key as keyof typeof inviteForm]}
                  onChange={e => setInviteForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                />
              </div>
            ))}

            {/* Role selector */}
            <div>
              <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>Role</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(["AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"] as Role[]).map(role => {
                  const rc = roleConfig[role];
                  const isSelected = inviteForm.role === role;
                  return (
                    <div
                      key={role}
                      onClick={() => setInviteForm(prev => ({ ...prev, role }))}
                      style={{
                        padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                        border: `1px solid ${isSelected ? rc.border : "var(--border)"}`,
                        background: isSelected ? rc.bg : "var(--surface-2)",
                        display: "flex", alignItems: "center", gap: "10px",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "13px", fontWeight: 500, color: isSelected ? rc.color : "var(--tp)", marginBottom: "2px" }}>
                          {rc.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--tm)" }}>
                          {rolePerms[role][0]}
                        </div>
                      </div>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={rc.color} strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "var(--em-subtle)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "11px", color: "var(--ts)", lineHeight: 1.6 }}>
                💡 Password sementara akan di-generate otomatis dan dikirim ke email member. Member wajib ganti password saat pertama login.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={closeModal} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Batal
              </button>
              <button style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                Kirim Undangan
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Modal: Edit Member ── */}
      {modalMode === "edit" && selectedMember && (
        <>
          <div onClick={closeModal} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 201, width: "420px",
            background: "var(--bg)", borderRadius: "20px",
            border: "1px solid var(--border)",
            padding: "28px", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            display: "flex", flexDirection: "column", gap: "16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, var(--em), var(--em2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {selectedMember.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--tp)" }}>{selectedMember.fullName}</div>
                <div style={{ fontSize: "12px", color: "var(--tm)" }}>{selectedMember.email}</div>
              </div>
            </div>

            {/* Role change */}
            <div>
              <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "8px", fontWeight: 500 }}>Ubah Role</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(["AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"] as Role[]).map(role => {
                  const rc = roleConfig[role];
                  const isSelected = selectedMember.role === role;
                  return (
                    <button key={role} style={{
                      padding: "6px 14px", borderRadius: "100px",
                      border: `1px solid ${isSelected ? rc.border : "var(--border)"}`,
                      background: isSelected ? rc.bg : "transparent",
                      color: isSelected ? rc.color : "var(--tm)",
                      fontSize: "12px", fontWeight: isSelected ? 500 : 400,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {rc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department */}
            <div>
              <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px", fontWeight: 500 }}>Departemen</div>
              <input
                defaultValue={selectedMember.department}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              />
            </div>

            {/* Reset password */}
            <div style={{ padding: "12px 14px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500, marginBottom: "2px" }}>Reset Password</div>
                <div style={{ fontSize: "11px", color: "var(--tm)" }}>Kirim password sementara baru ke email member</div>
              </div>
              <button style={{ padding: "7px 14px", borderRadius: "9px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0, whiteSpace: "nowrap" }}>
                Reset
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button onClick={closeModal} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Batal
              </button>
              <button style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}