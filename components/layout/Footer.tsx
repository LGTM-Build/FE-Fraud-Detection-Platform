'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden w-full" style={{ background: "var(--footer-bg)" }}>

      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-50"
        style={{ background: "linear-gradient(90deg, transparent, var(--em), transparent)" }}
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "900px",
          height: "300px",
          background: "radial-gradient(ellipse at center bottom, rgba(16,185,129,0.22) 0%, transparent 65%)"
        }}
      />

      {/* Side glows */}
      <div
        className="absolute top-[10%] left-[-100px] pointer-events-none blur-[40px]"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)"
        }}
      />
      <div
        className="absolute top-[10%] right-[-100px] pointer-events-none blur-[40px]"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)"
        }}
      />

      {/* Main content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 64px 0", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "48px", alignItems: "start" }}>

          {/* Brand */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "28px" }}>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 16px", border: "1px solid var(--footer-em-border)", borderRadius: "6px", width: "fit-content" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: "linear-gradient(135deg, var(--em-deep), var(--em))" }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#e8f5ee", letterSpacing: "2px", textTransform: "uppercase" }}>
                FRADARA®
              </span>
            </div>

            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--footer-text)", maxWidth: "340px", fontWeight: 300, margin: 0 }}>
              <em style={{ fontStyle: "italic", color: "var(--footer-text-em)" }}>Sign up</em>{" "}
              untuk memanfaatkan kekuatan AI Fradara dalam menjaga integritas keuangan perusahaan Anda.
            </p>

            <div style={{ display: "flex", maxWidth: "380px" }}>
              <input
                type="email"
                placeholder="Email perusahaan"
                style={{ flex: 1, padding: "13px 18px", background: "var(--footer-em-bg)", border: "1px solid var(--footer-em-input-b)", borderRight: "none", borderRadius: "8px 0 0 8px", color: "#e8f5ee", fontSize: "14px", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
              />
              <button style={{ padding: "13px 18px", background: "var(--em)", border: "none", borderRadius: "0 8px 8px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M8.5 4l4 4-4 4" stroke="#030c06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

          </div>

          {/* Services */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--footer-text-label)", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
              Layanan
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {["Deteksi Expense", "Procurement AI", "Vendor Intel", "Audit Report"].map(item => (
                <Link
                  key={item}
                  href="#"
                  style={{ fontSize: "14px", color: "var(--footer-text-link)", textDecoration: "none", fontWeight: 300, transition: "color 0.2s" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--em)")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--footer-text-link)")}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--footer-text-label)", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
              Perusahaan
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {["Tentang Kami", "Fitur", "Cara Kerja", "Blog", "Hubungi Kami"].map(item => (
                <Link
                  key={item}
                  href="#"
                  style={{ fontSize: "14px", color: "var(--footer-text-link)", textDecoration: "none", fontWeight: 300, transition: "color 0.2s" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--em)")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--footer-text-link)")}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--footer-divider)", marginTop: "60px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>

          <p style={{ fontSize: "12px", color: "var(--footer-text-dim)", letterSpacing: "0.3px", margin: 0 }}>
            ©2026 FRADARA®
          </p>

          <div style={{ opacity: 0.18 }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="10" stroke="#10b981" strokeWidth="1.2"/>
              <ellipse cx="13" cy="13" rx="5" ry="10" stroke="#10b981" strokeWidth="1.2"/>
              <line x1="3" y1="13" x2="23" y2="13" stroke="#10b981" strokeWidth="1.2"/>
            </svg>
          </div>

          <div style={{ display: "flex", gap: "24px" }}>
            {["Privasi", "Syarat & Ketentuan", "Cookie"].map(item => (
              <Link
                key={item}
                href="#"
                style={{ fontSize: "12px", color: "var(--footer-text-dim)", textDecoration: "none" }}
              >
                {item}
              </Link>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
}