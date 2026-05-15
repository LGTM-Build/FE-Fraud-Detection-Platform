"use client";

interface PageHeaderProps {
  isMobile?: boolean;
  onAddVendor: () => void;
}

export function PageHeader({ isMobile, onAddVendor }: PageHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
      <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 400, margin: 0 }}>
        Kelola daftar vendor, pantau status, dan tinjau informasi mitra bisnis perusahaan
      </p>

      <button
        onClick={onAddVendor}
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "9px 18px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, var(--em), var(--em2))",
          color: "#fff", fontSize: "13px", fontWeight: 500,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
          flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Vendor
      </button>
    </div>
  );
}