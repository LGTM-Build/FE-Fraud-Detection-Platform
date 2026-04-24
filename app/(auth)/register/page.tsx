"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

type Step = 1 | 2;

interface CompanyForm {
  companyName: string;
  industry: string;
  employeeCount: string;
}

interface UserForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INDUSTRIES = [
  "Software House",
  "Manufaktur",
  "Retail & FMCG",
  "Perbankan & Keuangan",
  "Konstruksi",
  "Logistik & Transportasi",
  "Kesehatan",
  "Pendidikan",
  "Pemerintahan",
  "Lainnya",
];

export default function RegisterPage() {
  const { theme, toggle } = useTheme();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);

  const [company, setCompany] = useState<CompanyForm>({
    companyName: "",
    industry: "",
    employeeCount: "",
  });

  const [user, setUser] = useState<UserForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleCompanyNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.industry) return;
    setStep(2);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (user.password !== user.confirmPassword) {
      setPasswordError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    setLoading(true);
    // TODO: Integrate with POST /auth/register-company
    // Payload:
    // {
    //   companyName: company.companyName,
    //   industry: company.industry,
    //   employeeCount: Number(company.employeeCount),
    //   fullName: user.fullName,
    //   email: user.email,
    //   password: user.password,
    // }
    // Response: { data: { accessToken, refreshToken, user: { id, fullName, email, companyId, role } } }
    setTimeout(() => setLoading(false), 1800);
  };

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    ) : (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    );

  const StepIndicator = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
      {[1, 2].map((s) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: step >= s
              ? "linear-gradient(135deg, var(--em) 0%, var(--em2) 100%)"
              : "var(--surface-2)",
            border: step >= s ? "none" : "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s",
          }}>
            {step > s ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <span style={{
                fontSize: "11px", fontWeight: 600,
                color: step === s ? "#fff" : "var(--tm)",
                fontFamily: "'DM Sans', sans-serif",
              }}>{s}</span>
            )}
          </div>
          {s < 2 && (
            <div style={{
              width: "36px", height: "1px",
              background: step > s ? "var(--em)" : "var(--border)",
              transition: "background 0.3s",
            }} />
          )}
        </div>
      ))}
      <span style={{ fontSize: "12px", color: "var(--tm)", marginLeft: "4px", fontWeight: 300 }}>
        Langkah {step} dari 2
      </span>
    </div>
  );

  const styles = `
    .reg-input {
      width: 100%;
      padding: 11px 14px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      color: var(--tp);
      font-family: "DM Sans", sans-serif;
      font-size: 14px;
      font-weight: 300;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .reg-input::placeholder { color: var(--tm); }
    .reg-input:focus {
      border-color: var(--em);
      box-shadow: 0 0 0 3px var(--em-subtle);
    }

    .custom-select-wrapper {
      position: relative;
    }
    .custom-select-trigger {
      width: 100%;
      padding: 11px 36px 11px 14px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--surface-2);
      color: var(--tp);
      font-family: "DM Sans", sans-serif;
      font-size: 14px;
      font-weight: 300;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      user-select: none;
    }
    .custom-select-trigger.open {
      border-color: var(--em);
      box-shadow: 0 0 0 3px var(--em-subtle);
    }
    .custom-select-trigger.placeholder { color: var(--tm); }
    .custom-select-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: var(--surface-2, var(--card-bg, #0f1f14));
      border: 1px solid var(--border);
      border-radius: 10px;
      z-index: 100;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      max-height: 220px;
      overflow-y: auto;
    }
    .custom-select-option {
      padding: 10px 14px;
      font-size: 13px;
      font-family: "DM Sans", sans-serif;
      font-weight: 300;
      color: var(--tp);
      cursor: pointer;
      transition: background 0.15s;
    }
    .custom-select-option:hover { background: var(--em-subtle); color: var(--em); }
    .custom-select-option.selected { color: var(--em); font-weight: 500; background: var(--em-subtle); }

    .reg-submit {
      width: 100%;
      padding: 13px;
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
    .reg-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 32px rgba(16,185,129,0.45);
    }
    .reg-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    .reg-back {
      width: 100%;
      padding: 13px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--ts);
      font-family: "DM Sans", sans-serif;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.2s;
    }
    .reg-back:hover {
      border-color: var(--em);
      color: var(--em);
      background: var(--em-subtle);
    }

    .pw-wrap { position: relative; }
    .pw-toggle {
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      color: var(--tm); padding: 4px; display: flex;
      align-items: center; transition: color 0.2s;
    }
    .pw-toggle:hover { color: var(--em); }

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

    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .loading-spin { animation: spin 0.8s linear infinite; }

    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .step-enter { animation: fadeSlideIn 0.35s ease forwards; }

    @media (max-width: 700px) {
      .reg-card { grid-template-columns: 1fr !important; min-height: unset !important; }
      .reg-left { display: none !important; }
      .reg-right { padding: 36px 28px !important; }
    }
    @media (max-width: 480px) {
      .reg-right { padding: 28px 20px !important; }
    }
  `;

  return (
    <>
      <style>{styles}</style>

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

        <div className="blob1" style={{ position: "fixed" }} />
        <div className="blob2" style={{ position: "fixed" }} />
        <div className="bg-grid" />

        {/* Theme toggle */}
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
            e.currentTarget.style.borderColor = "var(--em)";
            e.currentTarget.style.color = "var(--em)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--card-b)";
            e.currentTarget.style.color = "var(--ts)";
          }}
        >
          {theme === "dark"
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>
          }
        </button>

        {/* Back to login */}
        <Link
          href="/login"
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
            e.currentTarget.style.borderColor = "var(--em)";
            e.currentTarget.style.color = "var(--em)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--card-b)";
            e.currentTarget.style.color = "var(--ts)";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <path d="M10 6H2M5 3L2 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Masuk
        </Link>

        {/* Card — overflow visible supaya dropdown tidak terpotong */}
        <div
          className="reg-card"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            width: "100%",
            maxWidth: "940px",
            minHeight: "600px",
            borderRadius: "28px",
            overflow: "visible",
            border: "1px solid var(--card-b)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
            position: "relative",
            zIndex: 1,
          }}
        >

          {/* Left panel */}
          <div
            className="reg-left"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "#040d06",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "40px 40px 44px",
              borderRadius: "28px 0 0 28px",
            }}
          >
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
              borderRadius: "50%", top: "40%", right: "10%",
              background: "radial-gradient(circle, rgba(16,185,129,0.30) 0%, transparent 70%)",
              filter: "blur(30px)",
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
                fontSize: "clamp(26px, 3vw, 36px)",
                fontWeight: 800, lineHeight: 1.1,
                letterSpacing: "-1.5px",
                color: "#e8f5ee",
                marginBottom: "16px",
              }}>
                Mulai lindungi<br />
                <span style={{
                  background: "linear-gradient(90deg, #10b981, #6ee7b7, #d1fae5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  keuangan tim kamu.
                </span>
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(232,245,238,0.55)", lineHeight: 1.6, fontWeight: 300 }}>
                Daftar gratis — setup dalam 2 menit.<br />
                Trial 14 hari tanpa kartu kredit.
              </p>

              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Deteksi anomali transaksi secara real-time",
                  "Audit trail lengkap untuk setiap aksi",
                  "Multi-user dengan role management",
                ].map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{
                      marginTop: "2px", flexShrink: 0,
                      width: "16px", height: "16px", borderRadius: "50%",
                      background: "rgba(16,185,129,0.15)",
                      border: "1px solid rgba(16,185,129,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "12px", color: "rgba(232,245,238,0.60)", lineHeight: 1.5 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div
            className="reg-right"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              padding: "44px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: "0 28px 28px 0",
              border: "1px solid var(--card-b)",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "26px", fontWeight: 800,
                letterSpacing: "-0.8px", color: "var(--tp)",
                marginBottom: "6px",
              }}>
                {step === 1 ? "Daftarkan perusahaan" : "Buat akun admin"}
              </h1>
              <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--ts)", lineHeight: 1.5 }}>
                {step === 1
                  ? "Isi data perusahaan kamu terlebih dahulu"
                  : "Data ini untuk akun super_user pertama kamu"}
              </p>
            </div>

            <StepIndicator />

            {/* Step 1 */}
            {step === 1 && (
              <form
                key="step1"
                className="step-enter"
                onSubmit={handleCompanyNext}
                style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              >
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    className="reg-input"
                    placeholder="PT Maju Bersama"
                    value={company.companyName}
                    onChange={e => setCompany(p => ({ ...p, companyName: e.target.value }))}
                    required
                  />
                </div>

                {/* Industry — custom dropdown */}
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Industri
                  </label>
                  <div className="custom-select-wrapper">
                    <div
                      className={`custom-select-trigger ${industryOpen ? "open" : ""} ${!company.industry ? "placeholder" : ""}`}
                      onClick={() => setIndustryOpen(v => !v)}
                      onBlur={() => setTimeout(() => setIndustryOpen(false), 150)}
                      tabIndex={0}
                    >
                      <span>{company.industry || "Pilih industri..."}</span>
                      <svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{
                          transition: "transform 0.2s",
                          transform: industryOpen ? "rotate(180deg)" : "rotate(0deg)",
                          flexShrink: 0,
                        }}
                      >
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                    </div>

                    {industryOpen && (
                      <div className="custom-select-dropdown">
                        {INDUSTRIES.map(ind => (
                          <div
                            key={ind}
                            className={`custom-select-option ${company.industry === ind ? "selected" : ""}`}
                            onMouseDown={(e) => {
                              e.preventDefault(); // cegah blur sebelum onClick
                              setCompany(p => ({ ...p, industry: ind }));
                              setIndustryOpen(false);
                            }}
                          >
                            {ind}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* hidden input untuk form validation */}
                  <input
                    type="text"
                    value={company.industry}
                    required
                    readOnly
                    style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Jumlah Karyawan
                  </label>
                  <input
                    type="number"
                    className="reg-input"
                    placeholder="50"
                    min={1}
                    value={company.employeeCount}
                    onChange={e => setCompany(p => ({ ...p, employeeCount: e.target.value }))}
                    required
                  />
                  <p style={{ fontSize: "11px", color: "var(--tm)", marginTop: "5px", lineHeight: 1.4 }}>
                    Digunakan untuk konfigurasi awal platform.
                  </p>
                </div>

                <button type="submit" className="reg-submit" style={{ marginTop: "6px" }}>
                  Lanjut — Buat Akun Admin
                  <svg style={{ marginLeft: "8px", display: "inline", verticalAlign: "middle" }} width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form
                key="step2"
                className="step-enter"
                onSubmit={handleRegisterSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "13px" }}
              >
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    className="reg-input"
                    placeholder="Nama lengkap admin"
                    value={user.fullName}
                    onChange={e => setUser(p => ({ ...p, fullName: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="reg-input"
                    placeholder="admin@perusahaan.com"
                    value={user.email}
                    onChange={e => setUser(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Password
                  </label>
                  <div className="pw-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="reg-input"
                      placeholder="Min. 8 karakter"
                      value={user.password}
                      onChange={e => setUser(p => ({ ...p, password: e.target.value }))}
                      minLength={8}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 500, color: "var(--tm)", display: "block", marginBottom: "6px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    Konfirmasi Password
                  </label>
                  <div className="pw-wrap">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="reg-input"
                      placeholder="Ulangi password"
                      value={user.confirmPassword}
                      onChange={e => {
                        setUser(p => ({ ...p, confirmPassword: e.target.value }));
                        if (passwordError) setPasswordError("");
                      }}
                      required
                      style={{
                        paddingRight: "40px",
                        borderColor: passwordError ? "var(--danger, #ef4444)" : undefined,
                      }}
                    />
                    <button type="button" className="pw-toggle" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                  {passwordError && (
                    <p style={{ fontSize: "11px", color: "var(--danger, #ef4444)", marginTop: "5px", lineHeight: 1.4 }}>
                      {passwordError}
                    </p>
                  )}
                </div>

                <div style={{
                  padding: "10px 12px", borderRadius: "10px",
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.16)",
                  display: "flex", gap: "8px", alignItems: "flex-start",
                }}>
                  <svg style={{ flexShrink: 0, marginTop: "1px" }} width="13" height="13" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#10b981" strokeWidth="1.5"/>
                    <path d="M10 9v5M10 7v.5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <p style={{ fontSize: "11px", color: "var(--ts)", lineHeight: 1.5, margin: 0 }}>
                    Akun ini akan dibuat sebagai <strong style={{ color: "var(--em)", fontWeight: 600 }}>super_user</strong> — admin utama perusahaan yang bisa mengelola user lain.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                  <button type="submit" className="reg-submit" disabled={loading}>
                    {loading ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <svg className="loading-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Membuat akun...
                      </span>
                    ) : "Daftar Sekarang — Gratis"}
                  </button>
                  <button type="button" className="reg-back" onClick={() => setStep(1)} disabled={loading}>
                    ← Kembali ke data perusahaan
                  </button>
                </div>
              </form>
            )}

            <p style={{ fontSize: "11px", color: "var(--tm)", textAlign: "center", marginTop: "20px", lineHeight: 1.6 }}>
              Sudah punya akun?{" "}
              <Link href="/login" style={{ color: "var(--em)", textDecoration: "none", fontWeight: 500 }}>
                Masuk di sini
              </Link>
              {" "}·{" "}
              <a href="/terms" style={{ color: "var(--em)", textDecoration: "none" }}>Syarat & Ketentuan</a>
              {" "}·{" "}
              <a href="/privacy" style={{ color: "var(--em)", textDecoration: "none" }}>Privasi</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}