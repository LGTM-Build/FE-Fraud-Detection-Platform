"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ui/ThemeProvider";
import { api } from "@/lib/api";
import { setTokens, setUser as saveUser, AuthUser } from "@/lib/auth";

import RegisterLeftPanel from "@/components/auth/register/RegisterLeftPanel";
import StepIndicator from "@/components/auth/register/StepIndicator";
import CompanyForm, { CompanyFormData } from "@/components/auth/register/CompanyForm";
import UserForm, { UserFormData } from "@/components/auth/register/UserForm";
import styles from "./register.module.css";

type Step = 1 | 2;

export default function RegisterPage() {
  const { theme, toggle } = useTheme();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [industryOpen, setIndustryOpen] = useState(false);

  const [company, setCompany] = useState<CompanyFormData>({
    companyName: "",
    industry: "",
    employeeCount: "",
  });

  const [user, setUser] = useState<UserFormData>({
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
    setApiError("");

    if (user.password !== user.confirmPassword) {
      setPasswordError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{
        data: {
          accessToken: string;
          refreshToken: string;
          user: AuthUser;
        };
      }>(
        "/auth/register-company",
        {
          companyName: company.companyName,
          industry: company.industry,
          employeeCount: Number(company.employeeCount),
          fullName: user.fullName,
          email: user.email,
          password: user.password,
        },
        { skipAuth: true }
      );

      setTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      saveUser(res.data.user);
      router.push("/dashboard");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="blob1" style={{ position: "fixed" }} />
      <div className="blob2" style={{ position: "fixed" }} />
      <div className="bg-grid" />

      {/* Theme toggle */}
      <button className={styles.navBtn} onClick={toggle}>
        {theme === "dark" ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        )}
      </button>

      {/* Back to login */}
      <Link href="/login" className={styles.backLink}>
        <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
          <path d="M10 6H2M5 3L2 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Masuk
      </Link>

      {/* Card */}
      <div className={styles.regCard}>
        <RegisterLeftPanel />

        {/* Right panel */}
        <div className={styles.regRight}>
          <div style={{ marginBottom: "8px" }}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                color: "var(--tp)",
                marginBottom: "6px",
              }}
            >
              {step === 1 ? "Daftarkan perusahaan" : "Buat akun admin"}
            </h1>
            <p style={{ fontSize: "13px", fontWeight: 300, color: "var(--ts)", lineHeight: 1.5 }}>
              {step === 1
                ? "Isi data perusahaan kamu terlebih dahulu"
                : "Data ini untuk akun super_user pertama kamu"}
            </p>
          </div>

          <StepIndicator step={step} />

          {step === 1 && (
            <CompanyForm
              data={company}
              onChange={setCompany}
              onSubmit={handleCompanyNext}
              industryOpen={industryOpen}
              setIndustryOpen={setIndustryOpen}
            />
          )}

          {step === 2 && (
            <UserForm
              data={user}
              onChange={setUser}
              onSubmit={handleRegisterSubmit}
              onBack={() => setStep(1)}
              loading={loading}
              passwordError={passwordError}
              onPasswordErrorClear={() => setPasswordError("")}
              apiError={apiError}
            />
          )}

          <p
            style={{
              fontSize: "11px",
              color: "var(--tm)",
              textAlign: "center",
              marginTop: "20px",
              lineHeight: 1.6,
            }}
          >
            Sudah punya akun?{" "}
            <Link href="/login" style={{ color: "var(--em)", textDecoration: "none", fontWeight: 500 }}>
              Masuk di sini
            </Link>
            {" · "}
            <a href="/terms" style={{ color: "var(--em)", textDecoration: "none" }}>
              Syarat & Ketentuan
            </a>
            {" · "}
            <a href="/privacy" style={{ color: "var(--em)", textDecoration: "none" }}>
              Privasi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}