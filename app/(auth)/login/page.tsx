"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ui/ThemeProvider";
import { api } from "@/lib/api";
import { setTokens, setUser as saveUser, AuthUser } from "@/lib/auth";

import LoginLeftPanel from "@/components/auth/login/LoginLeftPanel";
import LoginForm from "@/components/auth/login/LoginForm";
import styles from "@/app/(auth)/login/login.module.css";

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
      setApiError(
        err instanceof Error ? err.message : "Login gagal. Periksa email dan password kamu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Background blobs */}
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

      {/* Back to landing */}
      <Link href="/" className={styles.backLink}>
        <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
          <path d="M10 6H2M5 3L2 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Kembali
      </Link>

      {/* Card */}
      <div className={styles.card}>
        <LoginLeftPanel />
        <LoginForm
          email={email}
          password={password}
          loading={loading}
          apiError={apiError}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}