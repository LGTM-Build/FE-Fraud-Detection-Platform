"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, NavItem, SidebarProps } from "@/data/sidebar";

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: collapsed ? "64px" : "220px",
      height: "100vh",
      // Light: white with green gradient accent | Dark: uses --footer-cta-bg
      background: "var(--sidebar-bg, var(--footer-cta-bg))",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.25s ease",
      overflow: "hidden",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>

      <style>{`
        /* Light mode sidebar override */
        [data-theme="light"] aside {
          background: linear-gradient(160deg, #ffffff 60%, rgba(16,185,129,0.06) 100%) !important;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          color: var(--ts);
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          position: relative;
          cursor: pointer;
        }
        .nav-item:hover { background: var(--em-subtle); color: var(--tp); }
        .nav-item.active {
          background: var(--em-subtle-2);
          color: var(--em);
          font-weight: 500;
        }
        .nav-item.active svg { stroke: var(--em); }

        .nav-badge {
          margin-left: auto;
          min-width: 18px; height: 18px;
          border-radius: 100px;
          background: rgba(16,185,129,0.12);
          color: var(--em);
          font-size: 10px; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          padding: 0 5px; flex-shrink: 0;
          border: 1px solid rgba(16,185,129,0.20);
        }

        .nav-group-label {
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 1.2px;
          color: var(--tm);
          padding: 0 12px; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden;
        }

        .collapse-btn {
          width: 24px; height: 24px;
          border-radius: 7px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--tm);
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .collapse-btn:hover {
          border-color: var(--em);
          color: var(--em);
          background: var(--em-subtle);
        }
      `}</style>

      {/* Logo row — exact 64px to match TopBar */}
      <div style={{
        height: "64px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: collapsed ? "0 17px" : "0 14px",
        gap: "10px",
        flexShrink: 0,
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        {/* Logo mark */}
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px",
          background: "linear-gradient(135deg, var(--em) 0%, var(--em2) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 14px rgba(16,185,129,0.25)",
        }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4"/>
            <path d="M6 10.5l3 3L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Wordmark */}
        {!collapsed && (
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "17px",
            color: "var(--tp)", letterSpacing: "-0.4px", flex: 1,
          }}>
            Fradara
          </span>
        )}

        {/* Collapse toggle — icon next to logo */}
        {!collapsed && (
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(true)}
            title="Tutup sidebar"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(false)}
            title="Buka sidebar"
            style={{ position: "absolute", bottom: "76px", left: "50%", transform: "translateX(-50%)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 8px" }}>
        {navItems.map((group, gi) => (
          <div key={gi} style={{ marginBottom: "24px" }}>
            {!collapsed && <div className="nav-group-label">{group.group}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {group.items.map((item: NavItem) => {
                const isActive = pathname === item.href;
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
                    {!collapsed && item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {item.badge && collapsed && (
                      <span style={{
                        position: "absolute", top: "6px", right: "8px",
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: "var(--em)",
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "12px 8px",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
        >
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--em), var(--em2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            AU
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                fontSize: "13px", fontWeight: 500, color: "var(--tp)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                Auditor User
              </div>
              <div style={{ fontSize: "11px", color: "var(--tm)" }}>Internal Auditor</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}