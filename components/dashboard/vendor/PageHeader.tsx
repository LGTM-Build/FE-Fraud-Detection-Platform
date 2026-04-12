export function PageHeader() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
          Vendor Intelligence
        </h1>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
          Profil risiko, relasi, dan riwayat fraud per vendor
        </p>
      </div>
    </div>
  );
}