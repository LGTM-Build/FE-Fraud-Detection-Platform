import styles from "@/app/(auth)/login/login.module.css";
import Image from "next/image";

const STATS = [
  { val: "99%", lbl: "Akurasi" },
  { val: "< 30s", lbl: "Per file" },
  { val: "SOC 2", lbl: "Compliant" },
];

export default function LoginLeftPanel() {
  return (
    <div className={styles.leftPanel}>
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
          top: "45%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(110,231,183,0.30) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Grid overlay */}
      <div className={styles.gridOverlay} />

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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/logo.png"
              alt="Fradara Logo"
              width={32}
              height={32}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              priority
            />
          </div>
          Fradara
        </div>
      </div>

      {/* Headline & stats */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(28px, 3.5vw, 38px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: "#e8f5ee",
            marginBottom: "16px",
          }}
        >
          Deteksi fraud
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #10b981, #6ee7b7, #d1fae5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            sebelum terlambat.
          </span>
        </h2>

        <p style={{ fontSize: "13px", color: "rgba(232,245,238,0.55)", lineHeight: 1.6, fontWeight: 300 }}>
          Platform audit keuangan berbasis AI
          <br />
          untuk tim internal Indonesia.
        </p>

        <div style={{ display: "flex", gap: "20px", marginTop: "24px" }}>
          {STATS.map((s) => (
            <div key={s.lbl} className={styles.statCard}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#10b981",
                  lineHeight: 1,
                }}
              >
                {s.val}
              </div>
              <div style={{ fontSize: "10px", color: "rgba(232,245,238,0.45)", marginTop: "3px" }}>
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}