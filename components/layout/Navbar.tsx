"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const islandStyle = (scrolled: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    borderRadius: "100px",
    border: `1px solid ${scrolled ? "var(--border-strong)" : "var(--card-b)"}`,
    background: "var(--nav-bg)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    boxShadow: scrolled ? "var(--nav-shadow)" : "none",
    transition: "all 0.3s ease",
    pointerEvents: "auto",
  });

  return (
    <nav style={{
      position: "fixed", top: "20px", left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px",
      pointerEvents: "none",
    }}>

      {/* Logo */}
      <div style={{ ...islandStyle(scrolled), padding: "8px 16px 8px 10px", gap: "10px" }}>
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "17px",
            color: "var(--tp)", textDecoration: "none", letterSpacing: "-0.4px",
          }}
        >
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: "linear-gradient(135deg, var(--em) 0%, var(--em2) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 14px rgba(16,185,129,0.35)",
          }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4"/>
              <path d="M6 10.5l3 3L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          Fradara
        </Link>
      </div>

      {/* Theme Toggle + CTA */}
      <div style={{ ...islandStyle(scrolled), padding: "8px", gap: "12px" }}>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          style={{
            width: "34px", height: "34px", borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, cursor: "pointer",
            color: "var(--ts)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--em)";
            (e.currentTarget as HTMLElement).style.color = "var(--em)";
            (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.color = "var(--ts)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          {theme === "dark"
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>
          }
        </button>

        {/* CTA */}
        <Link
          href="/login"
          style={{
            padding: "9px 20px", borderRadius: "100px",
            background: "linear-gradient(135deg, var(--em) 0%, var(--em2) 100%)",
            color: "#fff", fontSize: "13px", fontWeight: 500,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px",
            boxShadow: "var(--em-glow-btn)",
            transition: "all 0.25s",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1px", flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--em-glow-btn-hover)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "var(--em-glow-btn)";
          }}
        >
          Mulai Gratis
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

      </div>
    </nav>
  );
}