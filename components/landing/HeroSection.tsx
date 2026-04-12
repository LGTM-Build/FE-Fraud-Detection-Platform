'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const marqueeItems = [
    "Expense Fraud Detection", "Procurement Intelligence", "Smart CSV Mapper",
    "Vendor Watchlist", "AI Audit Report", "Isolation Forest",
    "Conflict of Interest Graph", "LKPP e-Katalog Benchmark",
  ];
  const allItems = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <style>{`
        /* ── HERO TITLE ANIMATION ── */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(40px) skewY(2deg); }
          to   { opacity: 1; transform: translateY(0) skewY(0deg); }
        }
        @keyframes heroBadgePop {
          0%   { opacity: 0; transform: scale(0.85) translateY(10px); }
          70%  { transform: scale(1.04) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes heroSubFade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroCTASlide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes strokeGlow {
          0%, 100% { filter: drop-shadow(0 0 0px var(--em)); }
          50%       { filter: drop-shadow(0 0 12px var(--em)); }
        }

        .hero-badge     { animation: heroBadgePop  0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .hero-line-1    { animation: heroFadeUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .hero-line-2    { animation: heroFadeUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.42s both; }
        .hero-line-3    { animation: heroFadeUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.59s both; }
        .hero-sub       { animation: heroSubFade 0.8s ease 0.78s both; }
        .hero-cta       { animation: heroCTASlide 0.7s ease 0.92s both; }
        .hero-marquee   { animation: heroCTASlide 0.7s ease 1.05s both; }

        .grad-text-anim {
          background: linear-gradient(90deg, var(--em) 0%, var(--em2) 40%, var(--em3) 70%, var(--em) 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradShift 4s ease infinite;
        }
        .stroke-text-anim {
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 1.5px var(--em);
          animation: strokeGlow 3s ease-in-out 1.5s infinite;
        }

        /* ── RESPONSIVE ── */
        .hero-section {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 24px 0;
          text-align: center;
          overflow-x: hidden;
        }
        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(40px, 10vw, 118px);
          font-weight: 800;
          line-height: 0.92;
          letter-spacing: clamp(-2px, -0.04em, -4px);
          color: var(--tp);
          margin-bottom: 32px;
          max-width: 1080px;
        }
        .hero-sub {
          font-size: clamp(14px, 1.8vw, 19px);
          font-weight: 300;
          color: var(--ts);
          line-height: 1.65;
          max-width: 560px;
          margin: 0 auto 48px;
          letter-spacing: 0.1px;
          padding: 0 8px;
        }
        .hero-cta-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 64px;
          padding: 0 16px;
        }
        .hero-btn-primary {
          font-size: clamp(13px, 1.5vw, 15px);
          padding: clamp(12px, 1.5vw, 16px) clamp(22px, 3vw, 34px);
          white-space: nowrap;
        }
        .hero-btn-ghost {
          font-size: clamp(13px, 1.5vw, 15px);
          padding: clamp(12px, 1.5vw, 16px) clamp(22px, 3vw, 34px);
          white-space: nowrap;
        }

        /* marquee fade edges */
        .marquee-fade-left {
          position: absolute; top: 0; left: 0; bottom: 0;
          width: clamp(60px, 10vw, 120px);
          background: linear-gradient(90deg, var(--bg), transparent);
          z-index: 2; pointer-events: none;
        }
        .marquee-fade-right {
          position: absolute; top: 0; right: 0; bottom: 0;
          width: clamp(60px, 10vw, 120px);
          background: linear-gradient(-90deg, var(--bg), transparent);
          z-index: 2; pointer-events: none;
        }

        @media (max-width: 640px) {
          .hero-section { padding: 88px 16px 0; }
          .hero-title { letter-spacing: -1.5px; }
          .hero-cta-wrap { flex-direction: column; gap: 10px; }
          .hero-btn-primary,
          .hero-btn-ghost { width: 100%; max-width: 320px; justify-content: center; }
        }
      `}</style>

      <section className="hero-section">

        {/* Badge */}
        <div className="glass hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "7px 10px", borderRadius: "100px", marginBottom: "40px" }}>
          <span className="blink" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)", marginLeft: "2px", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "var(--ts)", letterSpacing: "0.2px" }}>
            Platform fraud detection #1 untuk bisnis Indonesia
          </span>
        </div>

        {/* Title — each line animates independently */}
        <h1 className="hero-title" style={{ marginBottom: "32px" }}>
          <span className="hero-line-1" style={{ display: "block" }}>Deteksi Fraud</span>
          <span className="hero-line-2 grad-text-anim" style={{ display: "block" }}>Sebelum</span>
          <span className="hero-line-3 stroke-text-anim" style={{ display: "block" }}>Terlambat.</span>
        </h1>

        {/* Sub */}
        <p className="hero-sub">
          Upload CSV dari SAP, Odoo, atau Excel — AI Fradara langsung analisis ribuan transaksi,
          beri fraud score, dan hasilkan laporan audit dalam hitungan menit. Bukan jam.
        </p>

        {/* CTAs */}
        <div className="hero-cta hero-cta-wrap">
          <a href="#demo" className="btn-primary hero-btn-primary">
            Mulai Analisis Gratis
            <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
          <a href="#how-it-works" className="btn-ghost hero-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Tonton Demo ↗
          </a>
        </div>

        {/* Marquee */}
        <div className="hero-marquee" style={{ width: "100%", overflow: "hidden", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "14px 0", position: "relative", marginBottom: "80px" }}>
          <div className="marquee-fade-left" />
          <div className="marquee-fade-right" />
          <div className="marquee-track" style={{ display: "flex", width: "max-content" }}>
            {allItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 36px", whiteSpace: "nowrap", fontSize: "13px", fontWeight: 400, color: "var(--tm)", letterSpacing: "0.2px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--em)", opacity: 0.6, flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

      </section>
    </>
  );
}