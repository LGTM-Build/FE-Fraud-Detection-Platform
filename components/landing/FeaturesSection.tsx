'use client';

import { features, type Feature } from "@/data/features";
import { useTheme } from '@/components/ui/ThemeProvider';

export default function FeaturesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="features"
      style={{ position: "relative", zIndex: 1, padding: "0 64px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .feat-card {
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          cursor: pointer;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .feat-card-glass {
          background: var(--card-bg);
          border: 1px solid var(--card-b);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .feat-card-video {
          background: transparent;
          border: 1px solid var(--card-b);
        }
        .feat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 40px var(--em-glow);
        }
        .feat-card-glass:hover {
          border-color: var(--border-strong);
        }
        .feat-card-video:hover {
          border-color: rgba(16,185,129,0.40);
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "72px" }}>
        <div className="section-label" style={{ margin: "0 auto 24px" }}>
          <span className="blink" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
          Fitur Platform
        </div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(40px, 5vw, 64px)",
          fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2.5px",
          color: "var(--tp)", marginBottom: "20px",
        }}>
          Satu Platform.<br />
          <span className="grad-text">Semua Perlindungan.</span>
        </h2>
        <p style={{
          fontSize: "17px", fontWeight: 300, color: "var(--ts)",
          lineHeight: 1.65, maxWidth: "520px", margin: "0 auto",
        }}>
          Fradara menggabungkan deteksi fraud expense dan procurement dalam satu dashboard terpusat — tanpa tools enterprise yang mahal.
        </p>
      </div>

      {/* Bento grid */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "20px" }}>
        <FeatureCard feat={features[0]} tall isDark={isDark} />
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <FeatureCard feat={features[1]} isDark={isDark} />
          <FeatureCard feat={features[2]} isDark={isDark} />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feat, tall, isDark }: { feat: Feature; tall?: boolean; isDark: boolean }) {
  const hasVideo = "video" in feat && feat.video;

  return (
    <div
      className={`feat-card ${hasVideo ? "feat-card-video" : "feat-card-glass"}`}
      style={{ minHeight: tall ? "480px" : "220px" }}
    >

      {/* Video BG */}
      {hasVideo && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video autoPlay muted loop playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          >
            <source src={(feat as Feature & { video: string }).video} type="video/mp4" />
          </video>

          {/* Scrim — lighter in light mode, darker in dark mode */}
          <div style={{
            position: "absolute", inset: 0,
            background: isDark
              ? "linear-gradient(to bottom, rgba(4,12,8,0.15) 0%, rgba(4,12,8,0.10) 30%, rgba(4,12,8,0.82) 65%, rgba(4,12,8,0.97) 100%)"
              : "linear-gradient(to bottom, rgba(4,30,16,0.30) 0%, rgba(4,30,16,0.20) 30%, rgba(4,30,16,0.82) 65%, rgba(4,30,16,0.97) 100%)",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,80,50,0.08)" }} />
        </div>
      )}

      {/* Radial glow (glass cards only) */}
      {!hasVideo && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 110%, var(--em-subtle-2) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Top shimmer line */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "1px",
        background: "linear-gradient(90deg, transparent, var(--em), transparent)",
        opacity: hasVideo ? 0.35 : 0.45, zIndex: 2,
      }} />

      {/* ID badge */}
      <div style={{
        position: "absolute", top: "22px", right: "24px",
        fontFamily: "'Syne', sans-serif", fontSize: "11px", fontWeight: 700,
        color: hasVideo ? "rgba(232,245,238,0.22)" : "var(--tm)",
        letterSpacing: "1px", zIndex: 3, opacity: 0.6,
      }}>
        {feat.id}
      </div>

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: tall ? "40px 40px 44px" : "28px 32px 32px",
        ...(hasVideo ? {
          background: "linear-gradient(to top, rgba(4,12,8,0.92) 0%, rgba(4,12,8,0.60) 50%, transparent 100%)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        } : {}),
      }}>

        {/* Icon circle */}
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          border: "1px solid var(--border-strong)",
          background: hasVideo
            ? "rgba(10,30,20,0.50)"
            : "var(--surface-2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", marginBottom: "24px",
          backdropFilter: hasVideo ? "blur(8px)" : "none",
          WebkitBackdropFilter: hasVideo ? "blur(8px)" : "none",
        }}>
          <div style={{
            position: "absolute", inset: "-5px", borderRadius: "50%",
            border: "1px solid var(--border)", opacity: 0.4,
          }} />
          {feat.icon}
        </div>

        <p style={{
          fontSize: "10px", fontWeight: 600, color: "var(--em)",
          textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: "8px",
        }}>
          {feat.tag}
        </p>

        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: tall ? "28px" : "19px",
          fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.5px",
          color: hasVideo ? "#e8f5ee" : "var(--tp)",
          marginBottom: "12px",
        }}>
          {feat.title}
        </h3>

        <p style={{
          fontSize: "14px", fontWeight: 300,
          color: hasVideo ? "rgba(232,245,238,0.72)" : "var(--ts)",
          lineHeight: 1.65, marginBottom: "28px",
        }}>
          {feat.desc}
        </p>

        {/* Divider */}
        <div style={{
          width: "100%", height: "1px",
          background: hasVideo
            ? "linear-gradient(90deg, rgba(232,245,238,0.15), transparent)"
            : "linear-gradient(90deg, var(--border), transparent)",
          marginBottom: "24px",
        }} />

        {/* Stats */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "20px" }}>
          {feat.stats.map((s) => (
            <div key={s.lbl}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: "22px",
                fontWeight: 700, color: "var(--em)", lineHeight: 1,
              }}>
                {s.val}
              </div>
              <div style={{
                fontSize: "11px", marginTop: "4px",
                color: hasVideo ? "rgba(232,245,238,0.50)" : "var(--tm)",
              }}>
                {s.lbl}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {feat.tags.map((t) => (
            <span key={t} style={{
              padding: "4px 12px", borderRadius: "100px",
              background: "var(--em-subtle)",
              border: "1px solid var(--border)",
              fontSize: "11px",
              color: hasVideo ? "rgba(232,245,238,0.65)" : "var(--ts)",
              fontWeight: 400,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}