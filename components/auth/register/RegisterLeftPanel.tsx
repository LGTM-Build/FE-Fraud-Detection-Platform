import styles from "@/app/(auth)/register/register.module.css";

const FEATURES = [
  "Deteksi anomali transaksi secara real-time",
  "Audit trail lengkap untuk setiap aksi",
  "Multi-user dengan role management",
];

export default function RegisterLeftPanel() {
  return (
    <div className={styles.regLeft}>
      {/* Orbs */}
      <div
        className={styles.orbA}
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          top: "-60px",
          left: "-60px",
          background: "radial-gradient(circle, rgba(16,185,129,0.55) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className={styles.orbB}
        style={{
          position: "absolute",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          bottom: "-40px",
          right: "-40px",
          background: "radial-gradient(circle, rgba(10,107,71,0.60) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className={styles.orbC}
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          top: "40%",
          right: "10%",
          background: "radial-gradient(circle, rgba(16,185,129,0.30) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "18px",
            color: "#e8f5ee",
            letterSpacing: "-0.4px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #10b981, #6ee7b7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(16,185,129,0.50)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4" />
              <path
                d="M6 10.5l3 3L14.5 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Fradara
        </div>
      </div>

      {/* Headline & features */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: "#e8f5ee",
            marginBottom: "16px",
          }}
        >
          Mulai lindungi
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #10b981, #6ee7b7, #d1fae5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            keuangan tim kamu.
          </span>
        </h2>

        <p style={{ fontSize: "13px", color: "rgba(232,245,238,0.55)", lineHeight: 1.6, fontWeight: 300 }}>
          Daftar gratis — setup dalam 2 menit.
          <br />
          Trial 14 hari tanpa kartu kredit.
        </p>

        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {FEATURES.map((feat) => (
            <div key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div
                style={{
                  marginTop: "2px",
                  flexShrink: 0,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 4l2 2 3-3"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span style={{ fontSize: "12px", color: "rgba(232,245,238,0.60)", lineHeight: 1.5 }}>
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}