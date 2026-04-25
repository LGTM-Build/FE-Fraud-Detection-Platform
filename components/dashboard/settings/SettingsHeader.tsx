interface SettingsHeaderProps { isMobile?: boolean; }
export function SettingsHeader({ isMobile }: SettingsHeaderProps) {
  return (
    <div>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
        Settings
      </h1>
      <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
        Kelola pengguna, kebijakan, notifikasi, dan integrasi sistem
      </p>
    </div>
  );
}