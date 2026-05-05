import { useState } from "react";
import {
  TABLE_COL_HEADERS, fmt, fmtDate, statusConfig, getFraudRiskConfig,
  procurementCategoryLabels, type ExpenseTransaction,
} from "@/data/expenses";
import ScoreBar from "@/components/dashboard/expense/ScoreBar";

const PAGE_SIZE = 10;

interface TableProps {
  data: ExpenseTransaction[];
  onSelect: (tx: ExpenseTransaction) => void;
  isMobile: boolean;
}

function MobileList({ data, onSelect }: Omit<TableProps, "isMobile">) {
  return (
    <div>
      {data.map(t => {
        const sc   = statusConfig[t.status];
        const risk = getFraudRiskConfig(t.fraudScore);
        return (
          <div key={t.id} onClick={() => onSelect(t)}
            style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--em)" }}>{t.expenseId ?? t.id.slice(0, 8)}</span>
                <span style={{ fontSize: "10px", color: "var(--tm)", marginLeft: "6px" }}>{fmtDate(t.expenseDate)}</span>
              </div>
              <span style={{ padding: "2px 8px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "10px", fontWeight: 500 }}>{sc.label}</span>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{t.employeeName}</div>
              <div style={{ fontSize: "11px", color: "var(--tm)" }}>{procurementCategoryLabels[t.category]}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>{fmt(t.amountTotal)}</span>
              {t.fraudScore !== null
                ? <span style={{ fontSize: "11px", fontWeight: 700, color: risk.color, marginLeft: "auto" }}>Skor {t.fraudScore}</span>
                : <span style={{ fontSize: "11px", color: "#6366f1", marginLeft: "auto" }}>Menunggu AI</span>
              }
            </div>
            {t.flags.length > 0 && (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {t.flags.map(f => (
                  <span key={f} style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", fontSize: "10px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DesktopTable({ data, onSelect }: Omit<TableProps, "isMobile">) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {TABLE_COL_HEADERS.map(h => (
              <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", whiteSpace: "nowrap", background: "var(--surface-2)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((t, i) => {
            const sc = statusConfig[t.status];
            return (
              <tr key={t.id} onClick={() => onSelect(t)}
                style={{ borderBottom: i === data.length - 1 ? "none" : "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{t.expenseId ?? "—"}</div>
                  <div style={{ fontSize: "10px", color: "var(--tm)", fontFamily: "monospace" }}>{t.id.slice(0, 8)}…</div>
                </td>
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "12px", color: "var(--tm)" }}>{fmtDate(t.expenseDate)}</span>
                </td>
                <td style={{ padding: "13px 16px", maxWidth: "180px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.employeeName}</div>
                </td>
                <td style={{ padding: "13px 16px", maxWidth: "200px" }}>
                  <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
                  <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{t.merchant ?? "—"}</div>
                </td>
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "12px", color: "var(--ts)" }}>{t.department ?? "—"}</span>
                </td>
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>
                    {procurementCategoryLabels[t.category] ?? t.category}
                  </span>
                </td>
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{fmt(t.amountTotal)}</span>
                </td>
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  {t.fraudScore !== null
                    ? <ScoreBar score={t.fraudScore} />
                    : <span style={{ fontSize: "11px", color: "#6366f1" }}>Menunggu…</span>
                  }
                </td>
                <td style={{ padding: "13px 16px", minWidth: "160px" }}>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {t.flags.length === 0
                      ? <span style={{ fontSize: "11px", color: "var(--tm)" }}>—</span>
                      : t.flags.map(f => (
                        <span key={f} style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", fontSize: "10px", color: "#dc2626", fontWeight: 500, whiteSpace: "nowrap" }}>{f}</span>
                      ))
                    }
                  </div>
                </td>
                <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                    <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ProcurementTable({ data, onSelect, isMobile }: TableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const q = search.toLowerCase();
  const filtered = q
    ? data.filter(t =>
        (t.expenseId ?? "").toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.department ?? "").toLowerCase().includes(q) ||
        (t.employeeName ?? "").toLowerCase().includes(q) ||
        t.flags.some(f => f.toLowerCase().includes(q))
      )
    : data;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  return (
    <>
      <div style={{ padding: isMobile ? "10px 14px" : "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input value={search} onChange={e => handleSearch(e.target.value)}
          placeholder="Cari ID, vendor, item, departemen..."
          style={{ flex: 1, border: "none", background: "transparent", fontSize: "13px", color: "var(--tp)", outline: "none", fontFamily: "'DM Sans', sans-serif" }}
        />
        {search && (
          <>
            <button onClick={() => handleSearch("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--tm)", display: "flex", alignItems: "center", padding: "2px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <span style={{ fontSize: "11px", color: "var(--tm)", whiteSpace: "nowrap", flexShrink: 0 }}>{filtered.length} hasil</span>
          </>
        )}
      </div>

      {paged.length === 0 ? (
        <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <div style={{ fontSize: "13px", color: "var(--tm)" }}>Tidak ada transaksi yang cocok dengan <b>"{search}"</b></div>
        </div>
      ) : isMobile ? (
        <MobileList data={paged} onSelect={onSelect} />
      ) : (
        <DesktopTable data={paged} onSelect={onSelect} />
      )}

      <div style={{ padding: isMobile ? "12px 16px" : "13px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "12px", color: "var(--tm)" }}>
          {filtered.length === data.length ? `${filtered.length} transaksi` : `${filtered.length} dari ${data.length} transaksi`}
        </span>
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
              style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", cursor: safePage === 1 ? "not-allowed" : "pointer", opacity: safePage === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p); return acc;
              }, [])
              .map((p, i) => p === "..." ? (
                <span key={`e-${i}`} style={{ width: "30px", textAlign: "center", fontSize: "12px", color: "var(--tm)" }}>…</span>
              ) : (
                <button key={p} onClick={() => setPage(p as number)}
                  style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid var(--border)", background: safePage === p ? "var(--em)" : "var(--surface-2)", color: safePage === p ? "#fff" : "var(--ts)", cursor: "pointer", fontSize: "12px", fontWeight: safePage === p ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}>
                  {p}
                </button>
              ))
            }
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
              style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", cursor: safePage === totalPages ? "not-allowed" : "pointer", opacity: safePage === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}
        {!isMobile && totalPages <= 1 && (
          <span style={{ fontSize: "12px", color: "var(--tm)" }}>Klik baris untuk detail & tinjauan</span>
        )}
      </div>
    </>
  );
}