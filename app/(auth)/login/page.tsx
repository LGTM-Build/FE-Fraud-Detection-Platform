"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ui/ThemeProvider";
import { api } from "@/lib/api";
import { setTokens, setUser as saveUser, AuthUser } from "@/lib/auth";

export default function LoginPage() {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    try {
      const res = await api.post<{
        data: {
          accessToken: string;
          refreshToken: string;
          user: AuthUser;
        };
      }>(
        "/auth/login",
        { email, password },
        { skipAuth: true }
      );

      setTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });

      saveUser(res.data.user);

      router.push("/dashboard");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Login gagal. Periksa email dan password kamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--tp);
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input::placeholder { color: var(--tm); }
        .login-input:focus {
          border-color: var(--em);
          box-shadow: 0 0 0 3px var(--em-subtle);
        }
        .login-submit {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, var(--em) 0%, var(--em2) 100%);
          color: #fff;
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 24px rgba(16,185,129,0.30);
          letter-spacing: 0.1px;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(16,185,129,0.45);
        }
        .login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(16px) scale(0.97); }
        }
        .orb-a { animation: drift  7s ease-in-out infinite; }
        .orb-b { animation: drift2 9s ease-in-out infinite; }
        .orb-c { animation: drift  11s ease-in-out 2s infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .loading-spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background blobs */}
        <div className="blob1" style={{ position: "fixed" }} />
        <div className="blob2" style={{ position: "fixed" }} />
        <div className="bg-grid" />

        {/* Theme toggle — top right */}
        <button
          onClick={toggle}
          style={{
            position: "fixed", top: "20px", right: "24px", zIndex: 10,
            width: "38px", height: "38px", borderRadius: "50%",
            border: "1px solid var(--card-b)",
            background: "var(--card-bg)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--ts)", transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.borderColor = "var(--em)";
            (e.currentTarget).style.color = "var(--em)";
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.borderColor = "var(--card-b)";
            (e.currentTarget).style.color = "var(--ts)";
          }}
        >
          {theme === "dark"
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>
          }
        </button>

        {/* Back to landing */}
        <Link
          href="/"
          style={{
            position: "fixed", top: "20px", left: "24px", zIndex: 10,
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "9px 16px", borderRadius: "100px",
            border: "1px solid var(--card-b)",
            background: "var(--card-bg)", backdropFilter: "blur(12px)",
            color: "var(--ts)", fontSize: "13px", fontWeight: 400,
            textDecoration: "none", transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.borderColor = "var(--em)";
            (e.currentTarget).style.color = "var(--em)";
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.borderColor = "var(--card-b)";
            (e.currentTarget).style.color = "var(--ts)";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <path d="M10 6H2M5 3L2 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali
        </Link>

        {/* Card container */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: "100%",
          maxWidth: "920px",
          minHeight: "560px",
          borderRadius: "28px",
          overflow: "hidden",
          border: "1px solid var(--card-b)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          position: "relative",
          zIndex: 1,
        }}>

          {/* Left panel — visual */}
          <div style={{
            position: "relative",
            overflow: "hidden",
            background: "#040d06",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 40px 44px",
          }}>
            {/* Animated orbs */}
            <div className="orb-a" style={{
              position: "absolute", width: "320px", height: "320px",
              borderRadius: "50%", top: "-60px", left: "-60px",
              background: "radial-gradient(circle, rgba(16,185,129,0.55) 0%, transparent 70%)",
              filter: "blur(40px)",
            }} />
            <div className="orb-b" style={{
              position: "absolute", width: "260px", height: "260px",
              borderRadius: "50%", bottom: "-40px", right: "-40px",
              background: "radial-gradient(circle, rgba(10,107,71,0.60) 0%, transparent 70%)",
              filter: "blur(50px)",
            }} />
            <div className="orb-c" style={{
              position: "absolute", width: "180px", height: "180px",
              borderRadius: "50%", top: "45%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(110,231,183,0.30) 0%, transparent 70%)",
              filter: "blur(30px)",
            }} />

            {/* Subtle grid overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }} />

            {/* Logo */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px",
                color: "#e8f5ee", letterSpacing: "-0.4px",
              }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "linear-gradient(135deg, #10b981, #6ee7b7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 16px rgba(16,185,129,0.50)",
                }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.4" opacity="0.4"/>
                    <path d="M6 10.5l3 3L14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                Fradara
              </div>
            </div>

            {/* Headline */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 3.5vw, 38px)",
                fontWeight: 800, lineHeight: 1.1,
                letterSpacing: "-1.5px",
                color: "#e8f5ee",
                marginBottom: "16px",
              }}>
                Deteksi fraud<br />
                <span style={{
                  background: "linear-gradient(90deg, #10b981, #6ee7b7, #d1fae5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  sebelum terlambat.
                </span>
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(232,245,238,0.55)", lineHeight: 1.6, fontWeight: 300 }}>
                Platform audit keuangan berbasis AI<br />untuk tim internal Indonesia.
              </p>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: "20px", marginTop: "24px" }}>
                {[
                  { val: "99%", lbl: "Akurasi" },
                  { val: "< 30s", lbl: "Per file" },
                  { val: "SOC 2", lbl: "Compliant" },
                ].map(s => (
                  <div key={s.lbl} style={{
                    padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.18)",
                  }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "#10b981", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: "10px", color: "rgba(232,245,238,0.45)", marginTop: "3px" }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div style={{
            background: "var(--card-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>

            {/* Header */}
            <div style={{ marginBottom: "36px" }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "28px", fontWeight: 800,
                letterSpacing: "-1px", color: "var(--tp)",
                marginBottom: "8px",
              }}>
                Selamat datang
              </h1>
              <p style={{ fontSize: "14px", fontWeight: 300, color: "var(--ts)", lineHeight: 1.5 }}>
                Masuk ke dashboard Fradara Anda
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "8px", letterSpacing: "0.3px" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="nama@perusahaan.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--tm)", letterSpacing: "0.3px" }}>
                    Password
                  </label>
                  <a href="/forgot-password" style={{ fontSize: "12px", color: "var(--em)", textDecoration: "none", fontWeight: 400 }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                  >
                    Lupa password?
                  </a>
                </div>
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {apiError && (
                <div style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}>
                  <svg style={{ flexShrink: 0, marginTop: "1px" }} width="13" height="13" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5"/>
                    <path d="M10 6v5M10 13v.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <p style={{ fontSize: "11px", color: "#ef4444", lineHeight: 1.5, margin: 0 }}>
                    {apiError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
                style={{ marginTop: "8px" }}
              >
                {loading ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <svg className="loading-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    Memproses...
                  </span>
                ) : "Masuk ke Dashboard"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              <span style={{ fontSize: "11px", color: "var(--tm)", whiteSpace: "nowrap" }}>Belum punya akun?</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            </div>

            <Link
              href="/register"
              style={{
                display: "block", textAlign: "center",
                padding: "13px", borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--ts)", fontSize: "14px", fontWeight: 400,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget).style.borderColor = "var(--em)";
                (e.currentTarget).style.color = "var(--em)";
                (e.currentTarget).style.background = "var(--em-subtle)";
              }}
              onMouseLeave={e => {
                (e.currentTarget).style.borderColor = "var(--border)";
                (e.currentTarget).style.color = "var(--ts)";
                (e.currentTarget).style.background = "transparent";
              }}
            >
              Daftar Gratis — 14 hari trial
            </Link>

            <p style={{ fontSize: "11px", color: "var(--tm)", textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
              Dengan masuk, kamu menyetujui{" "}
              <a href="/terms" style={{ color: "var(--em)", textDecoration: "none" }}>Syarat & Ketentuan</a>
              {" "}dan{" "}
              <a href="/privacy" style={{ color: "var(--em)", textDecoration: "none" }}>Kebijakan Privasi</a>
              {" "}Fradara.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}