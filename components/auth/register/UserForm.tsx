import { useState } from "react";
import EyeIcon from "@/components/auth/register/EyeIcon";
import styles from "@/app/(auth)/register/register.module.css";

export interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type UserFormProps = {
  data: UserFormData;
  onChange: (data: UserFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  passwordError: string;
  onPasswordErrorClear: () => void;
  apiError: string;
};

export default function UserForm({
  data,
  onChange,
  onSubmit,
  onBack,
  loading,
  passwordError,
  onPasswordErrorClear,
  apiError,
}: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form
      key="step2"
      className={styles.stepEnter}
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "13px" }}
    >
      {/* Nama Lengkap */}
      <div>
        <label className={styles.fieldLabel}>Nama Lengkap</label>
        <input
          type="text"
          className={styles.regInput}
          placeholder="Nama lengkap admin"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className={styles.fieldLabel}>Email</label>
        <input
          type="email"
          className={styles.regInput}
          placeholder="admin@perusahaan.com"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className={styles.fieldLabel}>Password</label>
        <div className={styles.pwWrap}>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.regInput}
            placeholder="Min. 8 karakter"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            minLength={8}
            required
            style={{ paddingRight: "40px" }}
          />
          <button
            type="button"
            className={styles.pwToggle}
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      {/* Konfirmasi Password */}
      <div>
        <label className={styles.fieldLabel}>Konfirmasi Password</label>
        <div className={styles.pwWrap}>
          <input
            type={showConfirm ? "text" : "password"}
            className={styles.regInput}
            placeholder="Ulangi password"
            value={data.confirmPassword}
            onChange={(e) => {
              onChange({ ...data, confirmPassword: e.target.value });
              if (passwordError) onPasswordErrorClear();
            }}
            required
            style={{
              paddingRight: "40px",
              borderColor: passwordError ? "var(--danger, #ef4444)" : undefined,
            }}
          />
          <button
            type="button"
            className={styles.pwToggle}
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>
        {passwordError && (
          <p style={{ fontSize: "11px", color: "var(--danger, #ef4444)", marginTop: "5px", lineHeight: 1.4 }}>
            {passwordError}
          </p>
        )}
      </div>

      {/* Super user info banner */}
      <div className={styles.infoBanner}>
        <svg style={{ flexShrink: 0, marginTop: "1px" }} width="13" height="13" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="#10b981" strokeWidth="1.5" />
          <path d="M10 9v5M10 7v.5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: "11px", color: "var(--ts)", lineHeight: 1.5, margin: 0 }}>
          Akun ini akan dibuat sebagai{" "}
          <strong style={{ color: "var(--em)", fontWeight: 600 }}>super_user</strong> — admin utama
          perusahaan yang bisa mengelola user lain.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
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

        <button type="submit" className={styles.regSubmit} disabled={loading}>
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg
                className={styles.loadingSpin}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Membuat akun...
            </span>
          ) : (
            "Daftar Sekarang — Gratis"
          )}
        </button>

        <button
          type="button"
          className={styles.regBack}
          onClick={onBack}
          disabled={loading}
        >
          ← Kembali ke data perusahaan
        </button>
      </div>
    </form>
  );
}