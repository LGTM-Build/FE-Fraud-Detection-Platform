import { ExpenseTransaction, statusConfig, fmt } from "@/data/expenses";
import { ScoreBar } from "@/components/dashboard/expense/ScoreBar";

interface ExpenseTableProps {
  transactions: ExpenseTransaction[];
  total: number;
  onSelectTx: (tx: ExpenseTransaction) => void;
  isMobile?: boolean;
}

// Mobile card view per transaction
function ExpenseCard({ tx, onClick }: { tx: ExpenseTransaction; onClick: () => void }) {
  const sc = statusConfig[tx.status];
  const scoreColor = tx.fraudScore >= 70 ? "#ef4444" : tx.fraudScore >= 30 ? "#f59e0b" : "#10b981";

  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        transition: "background 0.15s",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
    >
      {/* Row 1: ID + Status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--em)" }}>{tx.id}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot }} />
          <span style={{
            padding: "2px 8px", borderRadius: "100px",
            background: sc.bg, color: sc.color,
            border: `1px solid ${sc.border}`,
            fontSize: "10px", fontWeight: 500,
          }}>{sc.label}</span>
        </div>
      </div>

      {/* Row 2: Description + merchant */}
      <div>
        <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 400, marginBottom: "2px" }}>
          {tx.description}
        </div>
        <div style={{ fontSize: "11px", color: "var(--tm)" }}>
          {tx.merchant} · {tx.employee} · {tx.department}
        </div>
      </div>

      {/* Row 3: Amount + score + category */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>{fmt(tx.amount)}</span>
        <span style={{
          padding: "2px 8px", borderRadius: "100px", fontSize: "10px",
          background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)",
        }}>{tx.category}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "auto" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: scoreColor }}>
            Score {tx.fraudScore}
          </span>
        </div>
      </div>

      {/* Row 4: Flags */}
      {tx.flags.length > 0 && (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {tx.flags.map(f => (
            <span key={f} style={{
              padding: "2px 8px", borderRadius: "100px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
              fontSize: "10px", color: "#dc2626", fontWeight: 500,
            }}>{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const TABLE_HEADERS = ["ID", "Tanggal", "Karyawan / Dept", "Deskripsi", "Kategori", "Jumlah", "Score", "Flag", "Status", ""];

export function ExpenseTable({ transactions, total, onSelectTx, isMobile }: ExpenseTableProps) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-b)",
      borderRadius: "16px",
      overflow: "hidden",
    }}>
      {isMobile ? (
        // Mobile: card list
        <div>
          {transactions.map(t => (
            <ExpenseCard key={t.id} tx={t} onClick={() => onSelectTx(t)} />
          ))}
        </div>
      ) : (
        // Desktop: table
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {TABLE_HEADERS.map(h => (
                  <th key={h} style={{
                    padding: "11px 16px", textAlign: "left",
                    fontSize: "11px", fontWeight: 600, color: "var(--tm)",
                    textTransform: "uppercase", letterSpacing: "0.8px",
                    whiteSpace: "nowrap", background: "var(--surface-2)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => {
                const sc = statusConfig[t.status];
                const isLast = i === transactions.length - 1;
                return (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTx(t)}
                    style={{
                      borderBottom: isLast ? "none" : "1px solid var(--border)",
                      cursor: "pointer", transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{t.id}</span>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{t.date}</span>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{t.employee}</div>
                      <div style={{ fontSize: "11px", color: "var(--tm)" }}>{t.department} · {t.grade}</div>
                    </td>
                    <td style={{ padding: "13px 16px", maxWidth: "220px" }}>
                      <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
                      <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{t.merchant}</div>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "100px", fontSize: "11px",
                        background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)",
                      }}>{t.category}</span>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{fmt(t.amount)}</span>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <ScoreBar score={t.fraudScore} />
                    </td>
                    <td style={{ padding: "13px 16px", minWidth: "140px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {t.flags.length === 0
                          ? <span style={{ fontSize: "11px", color: "var(--tm)" }}>—</span>
                          : t.flags.map(f => (
                            <span key={f} style={{
                              padding: "2px 8px", borderRadius: "100px",
                              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                              fontSize: "10px", color: "#dc2626", fontWeight: 500, whiteSpace: "nowrap",
                            }}>{f}</span>
                          ))
                        }
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                        <span style={{
                          padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500,
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        }}>{sc.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: isMobile ? "12px 16px" : "13px 20px",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "12px", color: "var(--tm)" }}>
          {transactions.length} dari {total} klaim
        </span>
        {!isMobile && (
          <span style={{ fontSize: "12px", color: "var(--tm)" }}>
            Klik baris untuk detail & review
          </span>
        )}
      </div>
    </div>
  );
}