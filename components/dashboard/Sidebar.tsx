"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUser, clearTokens, AuthUser, getRefreshToken } from "@/lib/auth";
import { api } from "@/lib/api";
import Image from "next/image";

type Role = "super_user" | "super_admin" | "auditor" | "operator" | "department_head";

// Role display metadata
const roleDisplay: Record<Role, { label: string; color: string; bg: string; border: string }> = {
  super_user:      { label: "Super User",    color: "#dc2626", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.18)" },
  super_admin:     { label: "Super Admin",   color: "#dc2626", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.18)" },
  auditor:        { label: "Auditor",        color: "var(--em)", bg: "var(--em-subtle)",      border: "rgba(16,185,129,0.20)" },
  operator:       { label: "Operator",       color: "#d97706", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.20)" },
  department_head: { label: "Kepala Dept", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.20)" },
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
  subItems?: { label: string; href: string }[];
}

interface NavGroup {
  group: string;
  roles: Role[];
  items: NavItem[];
}

const Icons = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  expense: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  procurement: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  vendor: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/>
      <circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/>
      <path d="M6 6l4 4M14 14l4 4M18 6l-4 4M10 14l-4 4"/>
    </svg>
  ),
  employee: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
    </svg>
  ),
  teams: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  chevronDown: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

const navGroups: NavGroup[] = [
  {
    group: "Monitor",
    roles: ["super_user", "super_admin", "auditor", "operator", "department_head"],
    items: [
      { label: "Beranda",      href: "/dashboard",             icon: Icons.dashboard,   roles: ["super_user", "super_admin", "auditor", "operator", "department_head"] },
      { label: "Pengeluaran",    href: "/dashboard/expense",     icon: Icons.expense,     roles: ["super_user", "super_admin", "auditor", "operator", "department_head"] },
      { label: "Pengadaan",        href: "/dashboard/procurement", icon: Icons.procurement, roles: ["super_user", "super_admin", "auditor", "operator", "department_head"] },
    ],
  },
  {
    group: "Manajemen Data",
    roles: ["super_user", "super_admin", "auditor", "operator", "department_head"],
    items: [
      { label: "Data Vendor",      href: "/dashboard/vendor",      icon: Icons.vendor,      roles: ["super_user", "super_admin", "auditor", "department_head"] },
      { label: "Data Karyawan",    href: "/dashboard/employee",    icon: Icons.employee,    roles: ["super_user", "super_admin", "operator", "department_head"] },
    ],
  },
  {
    group: "Sistem",
    roles: ["super_user", "super_admin"],
    items: [
      { label: "Manajemen Tim", href: "/dashboard/team",       icon: Icons.teams,       roles: ["super_user", "super_admin"] },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/dashboard/settings"));
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Default ke 'operator' sebelum user di-load agar tidak hydration mismatch
  const role = (user?.role ?? "operator") as Role;
  const rd = roleDisplay[role] ?? roleDisplay["operator"];

  const initials = user?.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const visibleGroups = navGroups
    .filter(g => g.roles.includes(role))
    .map(g => ({ ...g, items: g.items.filter(item => item.roles.includes(role)) }))
    .filter(g => g.items.length > 0);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const rt = getRefreshToken();
      if (rt) {
        await api.post("/auth/logout", { refreshToken: rt });
      }
    } catch {
      // Tetap logout meski request gagal
    } finally {
      clearTokens();
      router.push("/login");
    }
  };

  return (
    <aside style={{
      width: collapsed ? "64px" : "220px",
      height: "100vh",
      background: "var(--bg)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.25s ease",
      overflow: "hidden",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <style>{`
        [data-theme="light"] aside {
          background: #ffffff !important;
        }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 10px;
          text-decoration: none; font-size: 13px; font-weight: 400;
          color: var(--ts); transition: background 0.15s, color 0.15s;
          white-space: nowrap; position: relative; cursor: pointer;
          border: none; background: transparent; width: 100%; text-align: left;
          font-family: "DM Sans", sans-serif;
        }
        .nav-item:hover { background: var(--em-subtle); color: var(--tp); }
        .nav-item.active { background: var(--em-subtle-2); color: var(--em); font-weight: 500; }
        .nav-item.active svg { stroke: var(--em); }
        .nav-group-label {
          font-size: 10px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 1.2px; color: var(--tm);
          padding: 0 12px; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden;
        }
        .sub-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px 7px 38px; border-radius: 9px;
          text-decoration: none; font-size: 12px; font-weight: 400;
          color: var(--tm); transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .sub-item:hover { background: var(--em-subtle); color: var(--tp); }
        .sub-item.active { color: var(--em); font-weight: 500; }
        .collapse-btn {
          width: 24px; height: 24px; border-radius: 7px;
          border: 1px solid var(--border); background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--tm); transition: all 0.15s; flex-shrink: 0;
        }
        .collapse-btn:hover { border-color: var(--em); color: var(--em); background: var(--em-subtle); }
      `}</style>

      {/* Header & Collapse Toggle */}
      <div style={{
        height: "64px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        padding: collapsed ? "0" : "0 14px",
        gap: "10px", flexShrink: 0,
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        {collapsed ? (
          <button className="collapse-btn" onClick={() => setCollapsed(false)} title="Buka sidebar" style={{ width: "32px", height: "32px", borderRadius: "10px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ) : (
          <>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Image
                src="/logo.png"
                alt="Fradara Logo"
                width={32}
                height={32}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                priority
              />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "17px", color: "var(--tp)", letterSpacing: "-0.4px", flex: 1 }}>
              Fradara
            </span>
            <button className="collapse-btn" onClick={() => setCollapsed(true)} title="Tutup sidebar">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 8px" }}>
        {visibleGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: "24px" }}>
            {!collapsed && <div className="nav-group-label">{group.group}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {group.items.map(item => {
                const isActive = item.href === "/dashboard" 
                  ? pathname === "/dashboard" 
                  : pathname === item.href || pathname.startsWith(item.href + "/");
                
                const hasSubItems = !!item.subItems?.length;

                if (hasSubItems) {
                  return (
                    <div key={item.href}>
                      <button
                        className={`nav-item${isActive ? " active" : ""}`}
                        onClick={() => { if (!collapsed) setSettingsOpen(p => !p); }}
                        title={collapsed ? item.label : undefined}
                        style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                      >
                        <span style={{ flexShrink: 0 }}>{item.icon}</span>
                        {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                        {!collapsed && (
                          <span style={{ transition: "transform 0.2s", transform: settingsOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                            {Icons.chevronDown}
                          </span>
                        )}
                        {collapsed && isActive && (
                          <span style={{ position: "absolute", top: "6px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
                        )}
                      </button>
                      {!collapsed && settingsOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginTop: "2px" }}>
                          {item.subItems!.map(sub => (
                            <Link key={sub.href} href={sub.href} className={`sub-item${pathname === sub.href ? " active" : ""}`}>
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item${isActive ? " active" : ""}`}
                    title={collapsed ? item.label : undefined}
                    style={{ justifyContent: collapsed ? "center" : "flex-start" }}
                  >
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                    {collapsed && isActive && (
                      <span style={{ position: "absolute", top: "6px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "10px 8px", flexShrink: 0 }}>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 10px", borderRadius: "10px",
          justifyContent: collapsed ? "center" : "flex-start",
          marginBottom: "4px",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--em), var(--em2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, color: "#fff",
          }}>
            {initials}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.fullName ?? "—"}
              </div>
              <span style={{
                fontSize: "10px", padding: "1px 6px", borderRadius: "100px",
                background: rd.bg, color: rd.color, border: `1px solid ${rd.border}`,
                fontWeight: 500, display: "inline-block", marginTop: "2px",
              }}>
                {rd.label}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Keluar" : undefined}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "8px 12px", borderRadius: "10px",
            border: "none", background: "transparent", cursor: loggingOut ? "not-allowed" : "pointer",
            color: "var(--ts)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
            width: "100%", transition: "background 0.15s, color 0.15s",
            justifyContent: collapsed ? "center" : "flex-start",
            opacity: loggingOut ? 0.6 : 1,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--ts)";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && <span>{loggingOut ? "Keluar..." : "Keluar"}</span>}
        </button>
      </div>
    </aside>
  );
}