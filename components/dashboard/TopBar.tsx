"use client";
import { useTheme } from "@/components/ui/ThemeProvider";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function TopBar({ title, subtitle, onMenuClick, showMenuButton }: TopBarProps) {
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* Spacer so content doesn't hide behind fixed bar */}
      <div style={{ height: "64px", flexShrink: 0 }} />

      <header style={{
        position: "fixed",
        top: 0,
        left: showMenuButton ? "0" : "var(--sidebar-w, 220px)",
        right: 0,
        height: "64px",
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "var(--bg)",
        gap: "12px",
        transition: "left 0.25s ease",
      }}>
        <style>{`
          .topbar-icon-btn {
            width: 36px; height: 36px; border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--surface-2);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: var(--ts);
            transition: border-color 0.15s, color 0.15s, background 0.15s;
            flex-shrink: 0;
          }
          .topbar-icon-btn:hover {
            border-color: var(--em);
            color: var(--em);
            background: var(--em-subtle);
          }
          .topbar-search {
            display: flex; align-items: center; gap: 8px;
            padding: 0 12px; height: 36px;
            border-radius: 10px;
            border: 1px solid var(--border);
            background: var(--surface-2);
          }
          @media (max-width: 767px) {
            .topbar-search { display: none !important; }
            .topbar-subtitle { display: none !important; }
          }
          @media (max-width: 1023px) {
            .topbar-search input { width: 120px !important; }
          }
        `}</style>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Hamburger — mobile only */}
          {showMenuButton && (
            <button className="topbar-icon-btn" onClick={onMenuClick} aria-label="Buka menu">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}

          {/* Page title */}
          <div style={{ flexShrink: 0 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "16px", fontWeight: 700,
              color: "var(--tp)", letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}>
              {title}
            </h1>
            {subtitle && (
              <p className="topbar-subtitle" style={{ fontSize: "12px", color: "var(--tm)", marginTop: "1px" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>

          {/* Search */}
          <div className="topbar-search">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              placeholder="Cari transaksi..."
              style={{
                border: "none", background: "transparent",
                fontSize: "13px", color: "var(--tp)", outline: "none",
                width: "160px", fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <span style={{
              fontSize: "10px", color: "var(--tm)",
              background: "var(--em-subtle)", border: "1px solid var(--border)",
              padding: "1px 5px", borderRadius: "5px", flexShrink: 0,
            }}>
              ⌘K
            </span>
          </div>

          {/* Theme toggle */}
          <button className="topbar-icon-btn" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark"
              ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )
              : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
                </svg>
              )
            }
          </button>
        </div>
      </header>
    </>
  );
}