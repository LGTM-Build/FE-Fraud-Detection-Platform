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

  const scrollToStep = (idx: number) => {
    stepRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 1, padding: "120px 64px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <style>{`
        .hiw-step-card {
          background: var(--card-bg);
          border: 1px solid var(--card-b);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: 44px 48px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .hiw-step-card.active {
          border-color: var(--border-strong);
          box-shadow: 0 0 48px var(--em-glow);
        }
        .hiw-sidebar-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: transparent;
          transition: all 0.35s ease;
          cursor: pointer;
          flex-shrink: 0;
        }
        .hiw-sidebar-dot.active {
          background: var(--em);
          border-color: var(--em);
          box-shadow: 0 0 12px var(--em-glow);
        }
        .hiw-sidebar-label {
          font-size: 13px;
          font-weight: 400;
          color: var(--tm);
          transition: color 0.35s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .hiw-sidebar-label.active {
          color: var(--em);
          font-weight: 500;
        }
        .hiw-timeline-line {
          position: absolute;
          left: 4px;
          top: 16px;
          bottom: 16px;
          width: 2px;
          background: var(--border);
          border-radius: 2px;
        }
        .hiw-timeline-fill {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: linear-gradient(to bottom, var(--em), var(--em2));
          border-radius: 2px;
          transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hiw-detail-box {
          padding: 14px 18px;
          border-radius: 12px;
          background: var(--em-subtle);
          border: 1px solid var(--border-2);
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hiw-step-card { animation: fadeSlideUp 0.5s ease both; }
      `}</style>

      {/* Section Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "end", marginBottom: "80px" }}>
        <div>
          <div className="section-label" style={{ marginBottom: "24px" }}>
            <span className="blink" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
            Cara Kerja
          </div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2.5px",
            color: "var(--tp)",
          }}>
            Dari CSV ke<br /><span className="grad-text">Laporan Audit</span><br />dalam 5 langkah.
          </h2>
        </div>
        <div>
          <p style={{ fontSize: "17px", fontWeight: 300, color: "var(--ts)", lineHeight: 1.65, marginBottom: "28px" }}>
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

      {/* Main layout: sticky sidebar + scrollable steps */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "64px", alignItems: "start" }}>

        {/* Sticky Sidebar */}
        <div style={{ position: "sticky", top: "120px" }}>
          <div style={{ position: "relative" }}>

            {/* Step dots + labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px", position: "relative" }}>

              {/* Timeline line — ikut tinggi container dot */}
              <div style={{
                position: "absolute",
                left: "4px",
                top: "5px",
                bottom: "5px",
                width: "2px",
                background: "var(--border)",
                borderRadius: "2px",
              }}>
                <div style={{
                  position: "absolute",
                  left: 0, top: 0, width: "100%",
                  background: "linear-gradient(to bottom, var(--em), var(--em2))",
                  borderRadius: "2px",
                  transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  height: `${(activeStep / (steps.length - 1)) * 100}%`,
                }} />
              </div>

              {steps.map((step, idx) => (
                <div
                  key={step.num}
                  onClick={() => scrollToStep(idx)}
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div className={`hiw-sidebar-dot ${activeStep === idx ? 'active' : ''}`} />
                  <div>
                    <div style={{
                      fontSize: "10px", fontWeight: 600,
                      color: activeStep === idx ? "var(--em)" : "var(--tm)",
                      letterSpacing: "1px", textTransform: "uppercase",
                      marginBottom: "2px",
                      transition: "color 0.35s ease",
                    }}>
                      {step.num}
                    </div>
                    <div className={`hiw-sidebar-label ${activeStep === idx ? 'active' : ''}`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress text */}
          <div style={{ marginTop: "40px", paddingLeft: "4px" }}>
            <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "6px" }}>Progress</div>
            <div style={{ fontSize: "28px", fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "var(--em)" }}>
              {String(activeStep + 1).padStart(2, '0')}
              <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--tm)" }}> / 05</span>
            </div>
          </div>
        </div>

        {/* Scrollable Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {steps.map((step, idx) => (
            <div
              key={step.num}
              ref={el => { stepRefs.current[idx] = el; }}
              className={`hiw-step-card ${activeStep === idx ? 'active' : ''}`}
            >
              {/* Large watermark number */}
              <div style={{
                position: "absolute", top: "-10px", right: "24px",
                fontFamily: "'Syne', sans-serif", fontSize: "120px", fontWeight: 800,
                color: "var(--em)", opacity: 0.04, lineHeight: 1,
                pointerEvents: "none", userSelect: "none",
              }}>
                {step.num}
              </div>

              {/* Active glow top line */}
              {activeStep === idx && (
                <div style={{
                  position: "absolute", top: 0, left: "10%",
                  width: "80%", height: "1px",
                  background: "linear-gradient(90deg, transparent, var(--em), transparent)",
                }} />
              )}

              {/* Icon + subtitle row */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: "var(--em-subtle-2)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--em)", flexShrink: 0,
                }}>
                  {step.icon}
                </div>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--em)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "3px" }}>
                    {step.subtitle}
                  </p>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif", fontSize: "24px",
                    fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.6px",
                    color: "var(--tp)",
                  }}>
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                width: "100%", height: "1px",
                background: "linear-gradient(90deg, var(--border), transparent)",
                marginBottom: "20px",
              }} />

              <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--ts)", lineHeight: 1.7, marginBottom: "18px" }}>
                {step.desc}
              </p>

              <div className="hiw-detail-box">
                <p style={{ fontSize: "12px", color: "var(--tm)", lineHeight: 1.6 }}>
                  💡 {step.detail}
                </p>
              </div>

              {/* Step indicator bottom */}
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
              marginTop: "12px", padding: "48px", borderRadius: "20px",
              textAlign: "center", display: "flex", flexDirection: "column",
              alignItems: "center", gap: "20px",
              position: "relative", overflow: "hidden",
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
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800, letterSpacing: "-1.2px", color: "var(--tp)",
            }}>
              Mulai deteksi fraud hari ini.<br />
              <span className="grad-text">Gratis 14 hari.</span>
            </h3>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#demo" className="btn-primary" style={{ fontSize: "15px", padding: "16px 34px" }}>Mulai Trial Gratis</a>
              <a href="/features" className="btn-ghost" style={{ fontSize: "15px", padding: "16px 34px" }}>Lihat Semua Fitur ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}