'use client';

import { useEffect, useRef, useState } from 'react';
import { steps, type Step } from '@/data/how-it-works';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, idx) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(idx); },
        { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        position: "relative",
        zIndex: 1,
        padding: "120px clamp(20px, 5vw, 64px)",
        maxWidth: "1200px",
        margin: "0 auto",
        overflowX: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .hiw-step-card {
          background: var(--card-bg);
          border: 1px solid var(--card-b);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: clamp(20px, 4vw, 44px) clamp(16px, 4vw, 48px);
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          word-break: break-word;
        }
        .hiw-step-card.active {
          border-color: var(--border-strong);
          box-shadow: 0 0 48px var(--em-glow);
        }
        .hiw-detail-box {
          padding: 14px 18px; border-radius: 12px;
          background: var(--em-subtle);
          border: 1px solid var(--border-2);
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hiw-step-card { animation: fadeSlideUp 0.5s ease both; }

        .hiw-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: end;
          margin-bottom: 80px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .hiw-header {
            grid-template-columns: 1fr;
            gap: 32px;
            margin-bottom: 48px;
          }
        }

        @media (max-width: 480px) {
          .hiw-cta-btns {
            flex-direction: column !important;
            width: 100%;
          }
          .hiw-cta-btns a {
            width: 100% !important;
            justify-content: center !important;
            text-align: center;
          }
          .hiw-icon-title h3 { font-size: 18px !important; }
        }
      `}</style>

      {/* Section Header */}
      <div className="hiw-header">
        <div>
          <div className="section-label" style={{ marginBottom: "24px" }}>
            <span className="blink" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
            Cara Kerja
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px",
            color: "var(--tp)",
          }}>
            Dari CSV ke<br /><span className="grad-text">Laporan Audit</span><br />dalam 5 langkah.
          </h2>
        </div>
        <div>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", fontWeight: 300, color: "var(--ts)", lineHeight: 1.65, marginBottom: "28px" }}>
            Tidak perlu setup panjang, tidak perlu training tim. Fradara dirancang agar auditor non-teknis sekalipun bisa langsung menggunakannya di hari pertama.
          </p>
          <a href="#demo" className="btn-primary">
            Coba Sekarang
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Steps — full width, no sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", minWidth: 0 }}>
        {steps.map((step, idx) => (
          <div
            key={step.num}
            ref={el => { stepRefs.current[idx] = el; }}
            className={`hiw-step-card ${activeStep === idx ? 'active' : ''}`}
          >
            {/* Watermark number */}
            <div style={{
              position: "absolute", top: "-10px", right: "24px",
              fontFamily: "'Syne', sans-serif", fontSize: "120px", fontWeight: 800,
              color: "var(--em)", opacity: 0.04, lineHeight: 1,
              pointerEvents: "none", userSelect: "none",
            }}>
              {step.num}
            </div>

            {/* Active top line */}
            {activeStep === idx && (
              <div style={{
                position: "absolute", top: 0, left: "10%",
                width: "80%", height: "1px",
                background: "linear-gradient(90deg, transparent, var(--em), transparent)",
              }} />
            )}

            {/* Icon + title */}
            <div className="hiw-icon-title" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: "var(--em-subtle-2)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--em)", flexShrink: 0,
              }}>
                {step.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "3px" }}>
                  {step.subtitle}
                </p>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(17px, 2.5vw, 24px)",
                  fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.6px",
                  color: "var(--tp)", margin: 0,
                }}>
                  {step.title}
                </h3>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, var(--border), transparent)", marginBottom: "20px" }} />

            <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 300, color: "var(--ts)", lineHeight: 1.7, marginBottom: "18px" }}>
              {step.desc}
            </p>

            <div className="hiw-detail-box">
              <p style={{ fontSize: "12px", color: "var(--tm)", lineHeight: 1.6, margin: 0 }}>
                💡 {step.detail}
              </p>
            </div>

            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
              <div style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: activeStep === idx ? "var(--em)" : "var(--tm)",
                flexShrink: 0, transition: "background 0.35s ease",
                boxShadow: activeStep === idx ? "0 0 8px var(--em-glow)" : "none",
              }} />
              <span style={{ fontSize: "11px", color: "var(--tm)", fontWeight: 500 }}>
                Langkah {step.num} dari 05
              </span>
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div
          className="glass"
          style={{
            marginTop: "12px", padding: "clamp(28px, 4vw, 48px)", borderRadius: "20px",
            textAlign: "center", display: "flex", flexDirection: "column",
            alignItems: "center", gap: "20px",
            position: "relative", overflow: "hidden", width: "100%",
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, var(--em-subtle) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--em)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            Siap mencoba?
          </p>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(22px, 3vw, 36px)",
            fontWeight: 800, letterSpacing: "-1.2px", color: "var(--tp)", margin: 0,
          }}>
            Mulai deteksi fraud hari ini.<br />
            <span className="grad-text">Gratis 14 hari.</span>
          </h3>
          <div className="hiw-cta-btns" style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#demo" className="btn-primary" style={{ fontSize: "clamp(13px, 1.5vw, 15px)", padding: "16px 34px" }}>Mulai Trial Gratis</a>
            <a href="/features" className="btn-ghost" style={{ fontSize: "clamp(13px, 1.5vw, 15px)", padding: "16px 34px" }}>Lihat Semua Fitur ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}