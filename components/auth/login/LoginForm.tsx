import Link from "next/link";
import styles from "@/app/(auth)/login/login.module.css";

type LoginFormProps = {
  email: string;
  password: string;
  loading: boolean;
  apiError: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function LoginForm({
  email,
  password,
  loading,
  apiError,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className={styles.rightPanel}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-1px",
            color: "var(--tp)",
            marginBottom: "8px",
          }}
        >
          Selamat datang
        </h1>
        <p style={{ fontSize: "14px", fontWeight: 300, color: "var(--ts)", lineHeight: 1.5 }}>
          Masuk ke dashboard Fradara Anda
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Email */}
        <div>
          <label className={styles.fieldLabel}>Email</label>
          <input
            type="email"
            className={styles.loginInput}
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label className={styles.fieldLabel} style={{ margin: 0 }}>Password</label>
            <a
              href="/forgot-password"
              style={{ fontSize: "12px", color: "var(--em)", textDecoration: "none", fontWeight: 400 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Lupa password?
            </a>
          </div>
          <input
            type="password"
            className={styles.loginInput}
            placeholder="••••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />
        </div>

        {/* Error banner */}
        {apiError && (
          <div className={styles.errorBanner}>
            <svg style={{ flexShrink: 0, marginTop: "1px" }} width="13" height="13" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M10 6v5M10 13v.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: "11px", color: "#ef4444", lineHeight: 1.5, margin: 0 }}>
              {apiError}
            </p>
          </div>
        )}

        {/* Submit */}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg
                className={styles.loadingSpin}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Memproses...
            </span>
          ) : (
            "Masuk ke Dashboard"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span style={{ fontSize: "11px", color: "var(--tm)", whiteSpace: "nowrap" }}>
          Belum punya akun?
        </span>
        <div className={styles.dividerLine} />
      </div>

      {/* Register link */}
      <Link href="/register" className={styles.registerLink}>
        Daftar Gratis — 14 hari trial
      </Link>

      {/* Footer links */}
      <p
        style={{
          fontSize: "11px",
          color: "var(--tm)",
          textAlign: "center",
          marginTop: "20px",
          lineHeight: 1.6,
        }}
      >
        Dengan masuk, kamu menyetujui{" "}
        <a href="/terms" style={{ color: "var(--em)", textDecoration: "none" }}>
          Syarat & Ketentuan
        </a>
        {" "}dan{" "}
        <a href="/privacy" style={{ color: "var(--em)", textDecoration: "none" }}>
          Kebijakan Privasi
        </a>
        {" "}Fradara.
      </p>
    </div>
  );
}