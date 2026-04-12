import { ProcurementTransaction, statusConfig, fmt } from "@/data/procurement";
import { ScoreBar } from "@/components/dashboard/procurement/ScoreBar";

const TABLE_HEADERS = [
  "ID / No. PO", "Tanggal", "Vendor", "Item",
  "Unit Bisnis", "Metode", "Total", "Score", "Flag", "Status", "",
];

interface ProcurementTableProps {
  transactions: ProcurementTransaction[];
  total: number;
  onSelectTx: (tx: ProcurementTransaction) => void;
}

export function ProcurementTable({ transactions, total, onSelectTx }: ProcurementTableProps) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {TABLE_HEADERS.map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap", background: "var(--surface-2)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <ProcurementRow
                key={t.id}
                tx={t}
                isLast={i === transactions.length - 1}
                onClick={() => onSelectTx(t)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter shown={transactions.length} total={total} />
    </div>
  );
}

// ─── Row ────────────────────────────────────────────────────

function ProcurementRow({
  tx,
  isLast,
  onClick,
}: {
  tx: ProcurementTransaction;
  isLast: boolean;
  onClick: () => void;
}) {
  const sc = statusConfig[tx.status];

  return (
    <tr
      onClick={onClick}
      style={{ borderBottom: isLast ? "none" : "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--em-subtle)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {/* ID / PO */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{tx.id}</div>
        <div style={{ fontSize: "11px", color: "var(--tm)", fontFamily: "monospace" }}>{tx.docNumber}</div>
      </td>

      {/* Date */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "12px", color: "var(--tm)" }}>{tx.date}</span>
      </td>

      {/* Vendor */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap", maxWidth: "160px" }}>
        <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.vendorName}</div>
        <div style={{ fontSize: "10px", color: "var(--tm)", fontFamily: "monospace" }}>{tx.vendorTaxId}</div>
      </td>

      {/* Item */}
      <td style={{ padding: "13px 16px", maxWidth: "200px" }}>
        <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.itemDescription}</div>
        <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{tx.requester} → {tx.approver}</div>
      </td>

      {/* Business Unit */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "12px", color: "var(--ts)" }}>{tx.businessUnit}</span>
      </td>

      {/* Method */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>
          {tx.procurementMethod}
        </span>
      </td>

      {/* Amount */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{fmt(tx.amount)}</span>
      </td>

      {/* Score */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <ScoreBar score={tx.fraudScore} />
      </td>

      {/* Flags */}
      <td style={{ padding: "13px 16px", minWidth: "160px" }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {tx.flags.length === 0
            ? <span style={{ fontSize: "11px", color: "var(--tm)" }}>—</span>
            : tx.flags.map((f) => (
              <span key={f} style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", fontSize: "10px", color: "#dc2626", fontWeight: 500, whiteSpace: "nowrap" }}>
                {f}
              </span>
            ))
          }
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
          <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
            {sc.label}
          </span>
        </div>
      </td>

      {/* Chevron */}
      <td style={{ padding: "13px 16px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </td>
    </tr>
  );
}

// ─── Footer ─────────────────────────────────────────────────

function TableFooter({ shown, total }: { shown: number; total: number }) {
  return (
    <div style={{ padding: "13px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{shown} dari {total} transaksi ditampilkan</span>
      <span style={{ fontSize: "12px", color: "var(--tm)" }}>Klik baris untuk detail &amp; review</span>
    </div>
  );
}