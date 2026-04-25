import { useState } from "react";
import { users, roleConfig, rolePerms, UserRole } from "@/components/dashboard/settings/types";

interface UsersTabProps { isMobile?: boolean; }

function InviteModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", zIndex: 201,
        width: "min(420px, calc(100vw - 32px))",
        background: "var(--bg)", borderRadius: "20px",
        border: "1px solid var(--border)", padding: "28px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        display: "flex", flexDirection: "column", gap: "16px",
      }}>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", fontWeight: 700, color: "var(--tp)", marginBottom: "4px" }}>Undang Pengguna</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Kirim undangan via email</p>
        </div>
        {[{ label: "Email", placeholder: "nama@perusahaan.com", type: "email" }, { label: "Nama", placeholder: "Nama lengkap", type: "text" }].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px" }}>{f.label}</div>
            <input type={f.type} placeholder={f.placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}
        <div>
          <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px" }}>Peran</div>
          <select style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
            <option value="viewer">Viewer</option>
            <option value="auditor">Auditor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Batal</button>
          <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Kirim Undangan</button>
        </div>
      </div>
    </>
  );
}

// Mobile: user card
function UserCard({ u }: { u: typeof users[0] }) {
  const rc = roleConfig[u.role];
  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, var(--em), var(--em2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{u.name}</div>
            <div style={{ fontSize: "11px", color: "var(--tm)" }}>{u.email}</div>
          </div>
        </div>
        <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{rc.label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--tm)" }}>{u.department}</div>
          <div style={{ fontSize: "11px", color: "var(--tm)" }}>{u.lastActive}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: u.status === "active" ? "#10b981" : "var(--tm)" }} />
            <span style={{ fontSize: "11px", color: u.status === "active" ? "var(--em)" : "var(--tm)" }}>{u.status === "active" ? "Aktif" : "Nonaktif"}</span>
          </div>
          <button style={{ padding: "4px 10px", borderRadius: "7px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
        </div>
      </div>
    </div>
  );
}

export function UsersTab({ isMobile }: UsersTabProps) {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Role cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "12px" }}>
        {(["admin", "auditor", "viewer"] as UserRole[]).map(role => {
          const rc = roleConfig[role];
          return (
            <div key={role} style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{rc.label}</span>
                <span style={{ fontSize: "12px", color: "var(--tm)" }}>{users.filter(u => u.role === role).length} pengguna</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {rolePerms[role].map(p => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--ts)" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Users table / card list */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: isMobile ? "14px 16px" : "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>Daftar Pengguna</h3>
            <p style={{ fontSize: "12px", color: "var(--tm)" }}>{users.length} pengguna terdaftar</p>
          </div>
          <button onClick={() => setShowInvite(true)} style={{ padding: isMobile ? "7px 12px" : "8px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(16,185,129,0.25)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            {isMobile ? "Undang" : "Undang Pengguna"}
          </button>
        </div>

        {isMobile ? (
          <div>{users.map(u => <UserCard key={u.id} u={u} />)}</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Pengguna", "Departemen", "Peran", "Terakhir Aktif", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rc = roleConfig[u.role];
                return (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, var(--em), var(--em2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{u.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--tm)" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}><span style={{ fontSize: "12px", color: "var(--ts)" }}>{u.department}</span></td>
                    <td style={{ padding: "13px 16px" }}><span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{rc.label}</span></td>
                    <td style={{ padding: "13px 16px" }}><span style={{ fontSize: "12px", color: "var(--tm)" }}>{u.lastActive}</span></td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: u.status === "active" ? "#10b981" : "var(--tm)" }} />
                        <span style={{ fontSize: "12px", color: u.status === "active" ? "var(--em)" : "var(--tm)" }}>{u.status === "active" ? "Aktif" : "Nonaktif"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}><button style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}