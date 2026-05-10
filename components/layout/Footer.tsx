'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--footer-bg)", borderTop: "1px solid var(--line)", padding: "40px 0" }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "0 clamp(20px, 5vw, 64px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "24px"
      }}>
        
        {/* Kiri: Logo dengan warna teks putih agar aman di bg gelap */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: "linear-gradient(135deg, var(--em) 0%, var(--em2) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 14px rgba(16,185,129,0.35)",
          }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4"/>
              <path d="M6 10.5l3 3L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontWeight: 800, 
            fontSize: "17px", 
            color: "#FFFFFF", // Dipaksa putih karena background landing page cenderung gelap
            letterSpacing: "-0.4px" 
          }}>
            Fradara
          </span>
        </Link>

        {/* Kanan: Copyright saja, tanpa link kontak/privasi */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--tm)", margin: 0 }}>
            © 2026 FRADARA®. <span style={{ opacity: 0.6, marginLeft: "4px" }}>Deteksi Fraud Terpercaya Indonesia.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}