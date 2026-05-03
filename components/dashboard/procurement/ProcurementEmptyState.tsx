import type { ViewTab } from "@/data/procurement";

interface EmptyStateProps {
  tab: ViewTab;
  onAddManual: () => void;
  onImportCSV: () => void;
}

export default function ProcurementEmptyState({
  tab,
  onAddManual,
  onImportCSV,
}: EmptyStateProps) {
  if (tab === "history") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "72px 24px",
          gap: "12px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--tm)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--tp)" }}>
          Belum ada riwayat review
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--tm)",
            maxWidth: "320px",
            lineHeight: 1.6,
          }}
        >
          Transaksi yang sudah disetujui atau ditolak akan muncul di sini.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        gap: "16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--tp)",
            marginBottom: "6px",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Belum ada transaksi untuk direview
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--tm)",
            maxWidth: "360px",
            lineHeight: 1.6,
          }}
        >
          Upload data transaksi lewat Import CSV atau tambahkan satu per satu
          secara manual.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "4px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onImportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 20px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--em), var(--em2))",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Import CSV
        </button>
        <button
          onClick={onAddManual}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 20px",
            borderRadius: "10px",
            background: "var(--surface-2)",
            color: "var(--ts)",
            fontSize: "13px",
            border: "1px solid var(--border)",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Manual
        </button>
      </div>
    </div>
  );
}