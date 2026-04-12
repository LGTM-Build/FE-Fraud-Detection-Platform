'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px clamp(20px, 5vw, 64px) 0;
          position: relative;
          z-index: 1;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px 64px;
          align-items: start;
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .footer-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .footer-bottom-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px clamp(20px, 5vw, 64px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .footer-inner { padding-top: 56px; }
          .footer-grid { grid-template-columns: 1fr; gap: 36px; }
          .footer-cols { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-bottom-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
          .footer-globe { display: none; }
          .footer-legal { flex-wrap: wrap; gap: 12px !important; }
        }
        .footer-email-input {
          flex: 1; min-width: 0;
          padding: 13px 18px;
          background: var(--footer-em-bg);
          border: 1px solid var(--footer-em-input-b);
          border-right: none;
          border-radius: 8px 0 0 8px;
          color: #e8f5ee; font-size: 14px; outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .footer-email-input::placeholder { color: var(--footer-text-dim); }
      `}</style>

      <footer className="relative overflow-hidden w-full" style={{ background: "var(--footer-bg)", paddingTop: "64px" }}>

        <div className="absolute top-0 left-0 right-0 h-px opacity-50"
          style={{ background: "linear-gradient(90deg, transparent, var(--em), transparent)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: "900px", height: "300px", background: "radial-gradient(ellipse at center bottom, rgba(16,185,129,0.22) 0%, transparent 65%)" }} />
        <div className="absolute top-[10%] left-[-100px] pointer-events-none blur-[40px]"
          style={{ width: "400px", height: "400px", background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)" }} />
        <div className="absolute top-[10%] right-[-100px] pointer-events-none blur-[40px]"
          style={{ width: "400px", height: "400px", background: "radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)" }} />

        <div className="footer-inner">
          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 16px", border: "1px solid var(--footer-em-border)", borderRadius: "6px", width: "fit-content" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: "linear-gradient(135deg, var(--em-deep), var(--em))", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: "#e8f5ee", letterSpacing: "2px", textTransform: "uppercase" }}>
                  FRADARA®
                </span>
              </div>

              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--footer-text)", maxWidth: "340px", fontWeight: 300, margin: 0 }}>
                <em style={{ fontStyle: "italic", color: "var(--footer-text-em)" }}>Sign up</em>{" "}
                untuk memanfaatkan kekuatan AI Fradara dalam menjaga integritas keuangan perusahaan Anda.
              </p>

              <div style={{ display: "flex", width: "100%", maxWidth: "380px" }}>
                <input type="email" placeholder="Email perusahaan" className="footer-email-input" />
                <button style={{ padding: "13px 18px", background: "var(--em)", border: "none", borderRadius: "0 8px 8px 0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8.5 4l4 4-4 4" stroke="#030c06" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Link columns — proper div, no display:contents */}
            <div className="footer-cols">
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--footer-text-label)", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>Layanan</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {["Deteksi Expense", "Procurement AI", "Vendor Intel", "Audit Report"].map(item => (
                    <Link key={item} href="#"
                      style={{ fontSize: "14px", color: "var(--footer-text-link)", textDecoration: "none", fontWeight: 300, transition: "color 0.2s" }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--em)")}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--footer-text-link)")}
                    >{item}</Link>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--footer-text-label)", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>Perusahaan</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {["Tentang Kami", "Fitur", "Cara Kerja", "Blog", "Hubungi Kami"].map(item => (
                    <Link key={item} href="#"
                      style={{ fontSize: "14px", color: "var(--footer-text-link)", textDecoration: "none", fontWeight: 300, transition: "color 0.2s" }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--em)")}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--footer-text-link)")}
                    >{item}</Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--footer-divider)", marginTop: "60px", position: "relative", zIndex: 1 }}>
          <div className="footer-bottom-inner">
            <p style={{ fontSize: "12px", color: "var(--footer-text-dim)", letterSpacing: "0.3px", margin: 0 }}>©2026 FRADARA®</p>
            <div className="footer-globe" style={{ opacity: 0.18 }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="10" stroke="#10b981" strokeWidth="1.2"/>
                <ellipse cx="13" cy="13" rx="5" ry="10" stroke="#10b981" strokeWidth="1.2"/>
                <line x1="3" y1="13" x2="23" y2="13" stroke="#10b981" strokeWidth="1.2"/>
              </svg>
            </div>
            <div className="footer-legal" style={{ display: "flex", gap: "24px" }}>
              {["Privasi", "Syarat & Ketentuan", "Cookie"].map(item => (
                <Link key={item} href="#"
                  style={{ fontSize: "12px", color: "var(--footer-text-dim)", textDecoration: "none", whiteSpace: "nowrap" }}
                >{item}</Link>
              ))}
            </div>
          </div>
        </div>

      </footer>
    </>
  );
}