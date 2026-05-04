"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Role = "SUPER_USER" | "AUDITOR" | "OPERATOR" | "DEPARTMENT_HEAD";

interface NavItem {
  label: string;
  href: string;
  badge?: number;
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
  report: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  import: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
    </svg>
  ),
  chevronDown: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  chevronsUpDown: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="7 15 12 20 17 15"/>
      <polyline points="7 9 12 4 17 9"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

const navGroups: NavGroup[] = [
  {
    group: "Monitor",
    roles: ["SUPER_USER", "AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"],
    items: [
      { label: "Dashboard",         href: "/dashboard",             icon: Icons.dashboard,    roles: ["SUPER_USER", "AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"] },
      { label: "Expense Monitor",   href: "/dashboard/expense",     icon: Icons.expense,      roles: ["SUPER_USER", "AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"], badge: 12 },
      { label: "Procurement",       href: "/dashboard/procurement", icon: Icons.procurement,  roles: ["SUPER_USER", "AUDITOR", "OPERATOR"], badge: 5 },
      { label: "Vendor Intelligence",href: "/dashboard/vendor",     icon: Icons.vendor,       roles: ["SUPER_USER", "AUDITOR"] },
    ],
  },
  {
    group: "Operasional",
    roles: ["SUPER_USER", "AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"],
    items: [
      { label: "Report Generator",  href: "/dashboard/report",      icon: Icons.report,       roles: ["SUPER_USER", "AUDITOR", "DEPARTMENT_HEAD"] },
      { label: "Import Center",     href: "/dashboard/import",      icon: Icons.import,       roles: ["SUPER_USER", "OPERATOR"] },
    ],
  },
  {
    group: "Sistem",
    roles: ["SUPER_USER"],
    items: [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Icons.settings,
        roles: ["SUPER_USER"],
        subItems: [
          { label: "General",         href: "/dashboard/settings" },
          { label: "Team Management", href: "/dashboard/settings/team" },
        ],
      },
    ],
  },
];

// Role metadata
const roleData: Record<Role, { name: string; dept: string; color: string; bg: string; border: string }> = {
  SUPER_USER:      { name: "Admin User",    dept: "Super User",      color: "#dc2626", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.18)" },
  AUDITOR:         { name: "Auditor User",  dept: "Internal Audit",  color: "var(--em)", bg: "var(--em-subtle)",      border: "rgba(16,185,129,0.20)" },
  OPERATOR:        { name: "Operator User", dept: "Finance Ops",     color: "#d97706", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.20)" },
  DEPARTMENT_HEAD: { name: "Dept Head",     dept: "Department Head", color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.20)" },
};

const roleLabels: Record<Role, string> = {
  SUPER_USER: "Super User",
  AUDITOR: "Auditor",
  OPERATOR: "Operator",
  DEPARTMENT_HEAD: "Dept Head",
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<Role>("SUPER_USER");
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/dashboard/settings"));
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const rd = roleData[currentRole];

  // Close popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleRoleSwitch = (role: Role) => {
    setCurrentRole(role);
    setPopoverOpen(false);
    // If new role doesn't have access to settings, close accordion
    if (role !== "SUPER_USER") setSettingsOpen(false);
  };

  // Filter nav by current role
  const visibleGroups = navGroups
    .filter(g => g.roles.includes(currentRole))
    .map(g => ({ ...g, items: g.items.filter(item => item.roles.includes(currentRole)) }))
    .filter(g => g.items.length > 0);

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
        .nav-badge {
          margin-left: auto; min-width: 18px; height: 18px;
          border-radius: 100px; background: rgba(16,185,129,0.12);
          color: var(--em); font-size: 10px; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px; flex-shrink: 0;
          border: 1px solid rgba(16,185,129,0.20);
        }
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
        .profile-trigger {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 10px; cursor: pointer;
          transition: background 0.15s; border: none; background: transparent;
          width: 100%; text-align: left; font-family: "DM Sans", sans-serif;
        }
        .profile-trigger:hover { background: var(--em-subtle); }
        .role-option {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; border-radius: 9px;
          cursor: pointer; transition: background 0.15s;
          border: none; background: transparent; width: 100%;
          text-align: left; font-family: "DM Sans", sans-serif;
        }
        .role-option:hover { background: var(--em-subtle); }
        @keyframes popoverIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .popover-anim { animation: popoverIn 0.15s ease; }
      `}</style>

      {/* Logo — 64px exact */}
      <div style={{
        height: "64px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        padding: collapsed ? "0 17px" : "0 14px",
        gap: "10px", flexShrink: 0,
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, var(--em) 0%, var(--em2) 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 14px rgba(16,185,129,0.25)" }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4"/>
            <path d="M6 10.5l3 3L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {!collapsed && (
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "17px", color: "var(--tp)", letterSpacing: "-0.4px", flex: 1 }}>
            Fradara
          </span>
        )}
        {!collapsed && (
          <button className="collapse-btn" onClick={() => setCollapsed(true)} title="Tutup sidebar">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}
        {collapsed && (
          <button className="collapse-btn" onClick={() => setCollapsed(false)} title="Buka sidebar"
            style={{ position: "absolute", bottom: "76px", left: "50%", transform: "translateX(-50%)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 8px" }}>
        {visibleGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: "24px" }}>
            {!collapsed && <div className="nav-group-label">{group.group}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {group.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                    {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
                    {item.badge && collapsed && (
                      <span style={{ position: "absolute", top: "6px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile + Role Switcher */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "10px 8px", flexShrink: 0, position: "relative" }} ref={popoverRef}>

        {/* Popover */}
        {popoverOpen && !collapsed && (
          <div className="popover-anim" style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: "8px", right: "8px",
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: "14px", padding: "8px",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.14)",
            zIndex: 10,
          }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "1px", padding: "4px 8px 8px", borderBottom: "1px solid var(--border)", marginBottom: "6px" }}>
              Preview sebagai role
            </div>
            {(["SUPER_USER", "AUDITOR", "OPERATOR", "DEPARTMENT_HEAD"] as Role[]).map(role => {
              const rd = roleData[role];
              const isActive = currentRole === role;
              return (
                <button
                  key={role}
                  className="role-option"
                  onClick={() => handleRoleSwitch(role)}
                >
                  {/* Avatar */}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: isActive ? `linear-gradient(135deg, var(--em), var(--em2))` : "var(--surface-2)",
                    border: `1px solid ${isActive ? "transparent" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700,
                    color: isActive ? "#fff" : "var(--tm)",
                    flexShrink: 0,
                  }}>
                    {rd.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--tp)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {rd.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "1px" }}>
                      <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "100px", background: rd.bg, color: rd.color, border: `1px solid ${rd.border}`, fontWeight: 500 }}>
                        {roleLabels[role]}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <span style={{ color: "var(--em)", flexShrink: 0 }}>{Icons.check}</span>
                  )}
                </button>
              );
            })}

            {/* Dev note */}
            {/* <div style={{ margin: "8px 0 4px", padding: "8px 10px", borderRadius: "8px", background: "var(--em-subtle)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: "10px", color: "var(--tm)", lineHeight: 1.5 }}>
                🛠 Dev mode — ganti dengan <code style={{ fontSize: "10px", color: "var(--em)" }}>useAuth()</code> saat auth siap
              </p>
            </div> */}
          </div>
        )}

        {/* Profile trigger button */}
        <button
          className="profile-trigger"
          onClick={() => { if (!collapsed) setPopoverOpen(p => !p); }}
          title={collapsed ? `Role: ${roleLabels[currentRole]}` : undefined}
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
        >
          {/* Avatar */}
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--em), var(--em2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {rd.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>

          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {rd.name}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: rd.color }}>
                  {roleLabels[currentRole]}
                </div>
              </div>
              <span style={{ color: "var(--tm)", flexShrink: 0, transition: "transform 0.2s", transform: popoverOpen ? "rotate(180deg)" : "none" }}>
                {Icons.chevronsUpDown}
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}