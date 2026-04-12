import { ExpenseTransaction, statusConfig, fmt } from "@/data/expenses";

interface DetailDrawerProps {
  tx: ExpenseTransaction;
  onClose: () => void;
}

export function DetailDrawer({ tx, onClose }: DetailDrawerProps) {
  const sc = statusConfig[tx.status];
  const scoreColor =
    tx.fraudScore >= 70
      ? "#ef4444"
      : tx.fraudScore >= 30
      ? "#f59e0b"
      : "#10b981";

  const scoreBg =
    tx.fraudScore >= 70
      ? "rgba(239,68,68,0.08)"
      : tx.fraudScore >= 30
      ? "rgba(245,158,11,0.08)"
      : "rgba(16,185,129,0.08)";

  const scoreBorder =
    tx.fraudScore >= 70
      ? "rgba(239,68,68,0.20)"
      : tx.fraudScore >= 30
      ? "rgba(245,158,11,0.20)"
      : "rgba(16,185,129,0.20)";

  const scoreLabel =
    tx.fraudScore >= 70
      ? "High Risk — perlu tindakan segera"
      : tx.fraudScore >= 30
      ? "Medium Risk — perlu review"
      : "Low Risk — aman";

  const detailRows = [
    { label: "Deskripsi", value: tx.description },
    { label: "Kategori", value: tx.category },
    { label: "Merchant", value: tx.merchant },
    { label: "Karyawan", value: tx.employee },
    { label: "Departemen", value: tx.department },
    { label: "Jabatan", value: tx.grade },
    { label: "Tanggal", value: tx.date },
    { label: "Jumlah", value: fmt(tx.amount), highlight: true },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 201,
          width: "420px",
          background: "var(--bg)",
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <DrawerHeader tx={tx} onClose={onClose} />

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Fraud score */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "12px",
              background: scoreBg,
              border: `1px solid ${scoreBorder}`,
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--tm)",
                marginBottom: "8px",
                fontWeight: 500,
              }}
            >
              Fraud Score
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "36px",
                  fontWeight: 800,
                  color: scoreColor,
                  lineHeight: 1,
                }}
              >
                {tx.fraudScore}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: "6px",
                    borderRadius: "3px",
                    background: "var(--border)",
                    overflow: "hidden",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      width: `${tx.fraudScore}%`,
                      height: "100%",
                      background: scoreColor,
                      borderRadius: "3px",
                    }}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "var(--tm)" }}>
                  {scoreLabel}
                </div>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--em)"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--em)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Analisis AI
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--ts)",
                lineHeight: 1.65,
                fontWeight: 300,
              }}
            >
              {tx.aiExplanation}
            </p>
          </div>

          {/* Flags */}
          {tx.flags.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--tm)",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: "8px",
                }}
              >
                Fraud Flags
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {tx.flags.map((f) => (
                  <span
                    key={f}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "100px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.18)",
                      fontSize: "12px",
                      color: "#dc2626",
                      fontWeight: 500,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Transaction details */}
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--tm)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "10px",
              }}
            >
              Detail Transaksi
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {detailRows.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      i < detailRows.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    gap: "16px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: row.highlight ? 600 : 400,
                      color: row.highlight ? "var(--tp)" : "var(--ts)",
                      textAlign: "right",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--tm)" }}>Status:</span>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "100px",
                background: sc.bg,
                color: sc.color,
                border: `1px solid ${sc.border}`,
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {sc.label}
            </span>
          </div>
        </div>

        {/* Action buttons — only for pending/high-alert */}
        {(tx.status === "pending" || tx.status === "high-alert") && (
          <DrawerActions />
        )}
      </div>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function DrawerHeader({
  tx,
  onClose,
}: {
  tx: ExpenseTransaction;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--em)",
            fontWeight: 600,
            letterSpacing: "0.8px",
            marginBottom: "3px",
          }}
        >
          {tx.id}
        </div>
        <h3
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--tp)",
            letterSpacing: "-0.3px",
          }}
        >
          Detail Klaim
        </h3>
      </div>
      <button
        onClick={onClose}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "var(--surface-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--ts)",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function DrawerActions() {
  return (
    <div
      style={{
        padding: "16px 24px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "4px" }}>
        Tindakan Auditor
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, var(--em), var(--em2))",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(16,185,129,0.25)",
          }}
        >
          ✓ Approve
        </button>
        <button
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid rgba(239,68,68,0.30)",
            background: "rgba(239,68,68,0.06)",
            color: "#dc2626",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ✕ Reject
        </button>
        <button
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--surface-2)",
            color: "var(--ts)",
            fontSize: "13px",
            fontWeight: 400,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          ↑ Eskalasi
        </button>
      </div>
    </div>
  );
}