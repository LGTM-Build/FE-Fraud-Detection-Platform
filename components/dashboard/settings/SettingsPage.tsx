"use client";
import { useState } from "react";

type Tab = "users" | "policy" | "notifications" | "integrations";
type UserRole = "admin" | "auditor" | "viewer";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastActive: string;
  status: "active" | "inactive";
}

const users: User[] = [
  { id: "USR-001", name: "Dewi Rahayu",    email: "dewi@company.id",    role: "admin",   department: "Finance",    lastActive: "Hari ini, 09:14",   status: "active" },
  { id: "USR-002", name: "Rina Kusuma",    email: "rina@company.id",    role: "auditor", department: "Internal Audit", lastActive: "Hari ini, 08:45", status: "active" },
  { id: "USR-003", name: "Anton Susilo",   email: "anton@company.id",   role: "auditor", department: "Procurement", lastActive: "Kemarin, 16:30",   status: "active" },
  { id: "USR-004", name: "Fajar Nugroho",  email: "fajar@company.id",   role: "viewer",  department: "IT",          lastActive: "3 hari lalu",       status: "active" },
  { id: "USR-005", name: "Laila Sari",     email: "laila@company.id",   role: "viewer",  department: "HR",          lastActive: "1 minggu lalu",     status: "inactive" },
];

const roleConfig: Record<UserRole, { label: string; bg: string; color: string; border: string }> = {
  admin:   { label: "Admin",   bg: "rgba(239,68,68,0.08)",   color: "#dc2626", border: "rgba(239,68,68,0.18)" },
  auditor: { label: "Auditor", bg: "var(--em-subtle)",        color: "var(--em)", border: "rgba(16,185,129,0.20)" },
  viewer:  { label: "Viewer",  bg: "var(--surface-2)",        color: "var(--tm)", border: "var(--border)" },
};

const rolePerms: Record<UserRole, string[]> = {
  admin:   ["Upload CSV", "Manage users", "Edit policy", "Generate report", "Review transaksi", "Lihat semua data"],
  auditor: ["Review transaksi", "Approve / Reject / Eskalasi", "Generate report", "Lihat semua data"],
  viewer:  ["Lihat dashboard", "Lihat laporan (read-only)"],
};

interface PolicyRule {
  id: string;
  category: string;
  grade: string;
  limitPerClaim: number;
  limitPerMonth: number;
  requireReceipt: boolean;
  requireApproval: boolean;
}

const policyRules: PolicyRule[] = [
  { id: "POL-01", category: "Entertainment", grade: "Staff",     limitPerClaim: 500000,   limitPerMonth: 1500000,  requireReceipt: true,  requireApproval: true },
  { id: "POL-02", category: "Entertainment", grade: "Manager",   limitPerClaim: 2000000,  limitPerMonth: 6000000,  requireReceipt: true,  requireApproval: true },
  { id: "POL-03", category: "Entertainment", grade: "Director",  limitPerClaim: 10000000, limitPerMonth: 30000000, requireReceipt: true,  requireApproval: true },
  { id: "POL-04", category: "Transport",     grade: "Staff",     limitPerClaim: 300000,   limitPerMonth: 900000,   requireReceipt: false, requireApproval: false },
  { id: "POL-05", category: "Transport",     grade: "Manager",   limitPerClaim: 750000,   limitPerMonth: 2250000,  requireReceipt: false, requireApproval: false },
  { id: "POL-06", category: "Meals",         grade: "Staff",     limitPerClaim: 150000,   limitPerMonth: 600000,   requireReceipt: false, requireApproval: false },
  { id: "POL-07", category: "Meals",         grade: "Manager",   limitPerClaim: 300000,   limitPerMonth: 1200000,  requireReceipt: false, requireApproval: false },
  { id: "POL-08", category: "Training",      grade: "All",       limitPerClaim: 5000000,  limitPerMonth: 10000000, requireReceipt: true,  requireApproval: true },
];

function fmt(n: number) {
  if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(0) + "jt";
  return "Rp " + (n / 1000).toFixed(0) + "rb";
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: "36px", height: "20px", borderRadius: "100px", background: value ? "var(--em)" : "var(--border)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "2px", left: value ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("users");
  const [emailAlert, setEmailAlert]     = useState(true);
  const [waAlert, setWaAlert]           = useState(false);
  const [dailyDigest, setDailyDigest]   = useState(true);
  const [highAlertOnly, setHighAlertOnly] = useState(false);
  const [showInvite, setShowInvite]     = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "users",         label: "Pengguna & Peran" },
    { key: "policy",        label: "Policy Rules" },
    { key: "notifications", label: "Notifikasi" },
    { key: "integrations",  label: "Integrasi API" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>Settings</h1>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>Kelola pengguna, kebijakan, notifikasi, dan integrasi sistem</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "5px", width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "8px 18px", borderRadius: "10px", border: "none",
            fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontWeight: tab === t.key ? 500 : 400, transition: "all 0.15s",
            background: tab === t.key ? "var(--em-subtle-2)" : "transparent",
            color: tab === t.key ? "var(--em)" : "var(--tm)",
            whiteSpace: "nowrap",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Users ── */}
      {tab === "users" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Role info cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
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

          {/* Users table */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>Daftar Pengguna</h3>
                <p style={{ fontSize: "12px", color: "var(--tm)" }}>{users.length} pengguna terdaftar</p>
              </div>
              <button
                onClick={() => setShowInvite(true)}
                style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(16,185,129,0.25)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Undang Pengguna
              </button>
            </div>
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
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>{rc.label}</span>
                      </td>
                      <td style={{ padding: "13px 16px" }}><span style={{ fontSize: "12px", color: "var(--tm)" }}>{u.lastActive}</span></td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: u.status === "active" ? "#10b981" : "var(--tm)" }} />
                          <span style={{ fontSize: "12px", color: u.status === "active" ? "var(--em)" : "var(--tm)" }}>{u.status === "active" ? "Aktif" : "Nonaktif"}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <button style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Invite modal */}
          {showInvite && (
            <>
              <div onClick={() => setShowInvite(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
              <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 201, width: "400px", background: "var(--bg)", borderRadius: "20px", border: "1px solid var(--border)", padding: "28px", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "17px", fontWeight: 700, color: "var(--tp)", marginBottom: "4px" }}>Undang Pengguna</h3>
                  <p style={{ fontSize: "12px", color: "var(--tm)" }}>Kirim undangan via email</p>
                </div>
                {[{ label: "Email", placeholder: "nama@perusahaan.com", type: "email" }, { label: "Nama", placeholder: "Nama lengkap", type: "text" }].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px" }}>{f.label}</div>
                    <input type={f.type} placeholder={f.placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
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
                  <button onClick={() => setShowInvite(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Batal</button>
                  <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Kirim Undangan</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Tab: Policy ── */}
      {tab === "policy" && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>Policy Rules</h3>
              <p style={{ fontSize: "12px", color: "var(--tm)" }}>Batas klaim expense per kategori dan jabatan — digunakan AI untuk deteksi out-of-policy</p>
            </div>
            <button style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah Rule
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Kategori", "Jabatan", "Limit / Klaim", "Limit / Bulan", "Wajib Struk", "Wajib Approval", ""].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {policyRules.map((rule, i) => (
                  <tr key={rule.id} style={{ borderBottom: i < policyRules.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{rule.category}</span></td>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: "var(--ts)" }}>{rule.grade}</span></td>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>{fmt(rule.limitPerClaim)}</span></td>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "13px", color: "var(--ts)" }}>{fmt(rule.limitPerMonth)}</span></td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", color: rule.requireReceipt ? "var(--em)" : "var(--tm)", fontWeight: rule.requireReceipt ? 500 : 400 }}>
                        {rule.requireReceipt ? "✓ Ya" : "— Tidak"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", color: rule.requireApproval ? "var(--em)" : "var(--tm)", fontWeight: rule.requireApproval ? 500 : 400 }}>
                        {rule.requireApproval ? "✓ Ya" : "— Tidak"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button style={{ padding: "4px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Notifications ── */}
      {tab === "notifications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "560px" }}>
          {[
            { label: "Email Alert", desc: "Kirim notifikasi ke email saat ada transaksi high-alert baru", value: emailAlert, onChange: setEmailAlert },
            { label: "WhatsApp Alert", desc: "Kirim pesan WhatsApp ke nomor yang terdaftar (beta)", value: waAlert, onChange: setWaAlert },
            { label: "Daily Digest", desc: "Ringkasan harian dikirim setiap pukul 08.00", value: dailyDigest, onChange: setDailyDigest },
            { label: "High Alert Only", desc: "Hanya kirim notifikasi untuk fraud score > 70", value: highAlertOnly, onChange: setHighAlertOnly },
          ].map(opt => (
            <div key={opt.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--tp)", marginBottom: "3px" }}>{opt.label}</div>
                <div style={{ fontSize: "12px", color: "var(--tm)", fontWeight: 300 }}>{opt.desc}</div>
              </div>
              <Toggle value={opt.value} onChange={opt.onChange} />
            </div>
          ))}

          {/* Email config */}
          {emailAlert && (
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Konfigurasi Email</div>
              <div>
                <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px" }}>Penerima Alert</div>
                <input defaultValue="audit@company.id, cfo@company.id" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>Pisahkan dengan koma untuk beberapa email</div>
              </div>
            </div>
          )}

          <button style={{ padding: "11px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
            Simpan Pengaturan Notifikasi
          </button>
        </div>
      )}

      {/* ── Tab: Integrations ── */}
      {tab === "integrations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* API Key */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>API Key</h3>
              <p style={{ fontSize: "12px", color: "var(--tm)" }}>Gunakan API key ini untuk integrasi langsung dari sistem ERP</p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", fontFamily: "monospace", fontSize: "13px", color: "var(--ts)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                frd_live_sk_••••••••••••••••••••••••••••••••
              </div>
              <button style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                Tampilkan
              </button>
              <button style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                Regenerate
              </button>
            </div>
          </div>

          {/* ERP integrations */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>Integrasi ERP</h3>
              <p style={{ fontSize: "12px", color: "var(--tm)" }}>Hubungkan langsung ke sistem ERP untuk auto-import</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { name: "SAP / SAP Concur", desc: "Auto-import expense & PO dari SAP", connected: true,  icon: "🏢" },
                { name: "Odoo",             desc: "Sinkronisasi transaksi Odoo secara berkala", connected: false, icon: "🟣" },
                { name: "Accurate Online",  desc: "Import jurnal & faktur dari Accurate", connected: false, icon: "🔵" },
                { name: "Jurnal.id",        desc: "Hubungkan akun Jurnal.id via OAuth", connected: false, icon: "📊" },
                { name: "Talenta",          desc: "Import data expense karyawan dari Talenta", connected: false, icon: "👥" },
              ].map((erp, i, arr) => (
                <div key={erp.name} style={{ padding: "16px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>{erp.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", marginBottom: "2px" }}>{erp.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--tm)" }}>{erp.desc}</div>
                  </div>
                  {erp.connected
                    ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--em)", fontWeight: 500 }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
                          Terhubung
                        </span>
                        <button style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Putuskan</button>
                      </div>
                    )
                    : (
                      <button style={{ padding: "7px 16px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget).style.borderColor = "var(--em)"; (e.currentTarget).style.color = "var(--em)"; }}
                        onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--ts)"; }}
                      >
                        Hubungkan
                      </button>
                    )
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Webhook */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Webhook</h3>
              <p style={{ fontSize: "12px", color: "var(--tm)" }}>Kirim event ke endpoint eksternal saat transaksi di-flag</p>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px" }}>Endpoint URL</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input placeholder="https://your-system.com/webhook/fradara" style={{ flex: 1, padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                <button style={{ padding: "9px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}