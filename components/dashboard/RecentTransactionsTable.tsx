"use client";
import { useState } from "react";
import Link from "next/link";
import {
  mockData, statusConfig, moduleConfig,
  type FilterModule, type FilterStatus,
} from "@/data/transactions";
import ScoreBadge from "@/components/ui/ScoreBadge";

const tableHeaders = ["ID", "Tanggal", "Deskripsi", "Modul", "Jumlah", "Fraud Score", "Flag", "Status", ""];

interface RecentTransactionsTableProps {
  isMobile?: boolean;
}

// Mobile card view for a single transaction
function TransactionCard({ t }: { t: typeof mockData[0] }) {
  const sc = statusConfig[t.status];
  const mc = moduleConfig[t.module];

  return (
    <div style={{
      padding: "14px 16px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      cursor: "pointer",
      transition: "background 0.15s",
    }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
    >
      {/* Row 1: ID + Status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--em)", fontFamily: "'DM Sans', monospace" }}>
          {t.id}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
          <span style={{
            padding: "2px 8px", borderRadius: "100px",
            background: sc.bg, color: sc.color,
            border: `1px solid ${sc.border}`,
            fontSize: "10px", fontWeight: 500,
          }}>
            {sc.label}
          </span>
        </div>
      </div>

      {/* Row 2: Description */}
      <div>
        <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 400, marginBottom: "2px" }}>
          {t.description}
        </div>
        <div style={{ fontSize: "11px", color: "var(--tm)" }}>
          {t.employee}{t.vendor ? ` · ${t.vendor}` : ""}
        </div>
      </div>

      {/* Row 3: Amount + Module + Score */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>
          {t.amount}
        </span>
        <span style={{
          padding: "2px 8px", borderRadius: "100px",
          background: mc.bg, color: mc.color,
          border: `1px solid ${mc.border}`,
          fontSize: "10px", fontWeight: 500,
        }}>
          {mc.label}
        </span>
        <ScoreBadge score={t.fraudScore} />
      </div>

      {/* Row 4: Flags + Date + Action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", flex: 1 }}>
          {t.flags.length === 0
            ? <span style={{ fontSize: "11px", color: "var(--tm)" }}>{t.date}</span>
            : t.flags.map(flag => (
              <span key={flag} style={{
                padding: "2px 7px", borderRadius: "100px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                fontSize: "10px", color: "#dc2626", fontWeight: 500,
              }}>
                {flag}
              </span>
            ))
          }
        </div>
        {t.status !== "auto-approved" && (
          <button
            style={{
              padding: "5px 12px", borderRadius: "8px",
              border: "1px solid var(--em)",
              background: "var(--em-subtle)",
              fontSize: "11px", color: "var(--em)",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500, flexShrink: 0,
            }}
          >
            Review →
          </button>
        )}
      </div>
    </div>
  );
}

export default function RecentTransactionsTable({ isMobile }: RecentTransactionsTableProps) {
  const [filterModule, setFilterModule] = useState<FilterModule>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filtered = mockData.filter(t => {
    if (filterModule !== "all" && t.module !== filterModule) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-b)",
      borderRadius: "16px",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        padding: isMobile ? "16px" : "20px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        gap: "12px",
      }}>
        <div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "15px", fontWeight: 700,
            color: "var(--tp)", letterSpacing: "-0.3px", marginBottom: "3px",
          }}>
            Transaksi Terbaru
          </h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>
            {filtered.length} transaksi ditampilkan
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>

          {/* Module filter */}
          <div style={{
            display: "flex", background: "var(--surface-2)",
            border: "1px solid var(--border)", borderRadius: "10px",
            padding: "3px", gap: "2px",
            flex: isMobile ? 1 : "none",
          }}>
            {(["all", "expense", "procurement"] as FilterModule[]).map(f => (
              <button
                key={f}
                onClick={() => setFilterModule(f)}
                style={{
                  padding: isMobile ? "5px 8px" : "5px 12px",
                  borderRadius: "8px", border: "none",
                  fontSize: "11px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                  fontWeight: filterModule === f ? 500 : 400,
                  background: filterModule === f ? "var(--em-subtle-2)" : "transparent",
                  color: filterModule === f ? "var(--em)" : "var(--tm)",
                  flex: isMobile ? 1 : "none",
                  whiteSpace: "nowrap",
                }}
              >
                {f === "all" ? "Semua" : f === "expense" ? "Expense" : "Procurement"}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{
            display: "flex", background: "var(--surface-2)",
            border: "1px solid var(--border)", borderRadius: "10px",
            padding: "3px", gap: "2px",
            flex: isMobile ? 1 : "none",
          }}>
            {(["all", "pending", "high-alert"] as FilterStatus[]).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                style={{
                  padding: isMobile ? "5px 8px" : "5px 12px",
                  borderRadius: "8px", border: "none",
                  fontSize: "11px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                  fontWeight: filterStatus === f ? 500 : 400,
                  background: filterStatus === f ? "var(--em-subtle-2)" : "transparent",
                  color: filterStatus === f ? "var(--em)" : "var(--tm)",
                  flex: isMobile ? 1 : "none",
                  whiteSpace: "nowrap",
                }}
              >
                {f === "all" ? "Semua" : f === "pending" ? "Pending" : "High Alert"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: card list / Desktop: table */}
      {isMobile ? (
        <div>
          {filtered.map(t => (
            <TransactionCard key={t.id} t={t} />
          ))}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {tableHeaders.map(h => (
                  <th key={h} style={{
                    padding: "11px 16px", textAlign: "left",
                    fontSize: "11px", fontWeight: 600, color: "var(--tm)",
                    textTransform: "uppercase", letterSpacing: "0.8px",
                    whiteSpace: "nowrap", background: "var(--surface-2)",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const sc = statusConfig[t.status];
                const mc = moduleConfig[t.module];
                const isLast = i === filtered.length - 1;

                return (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: isLast ? "none" : "1px solid var(--border)",
                      transition: "background 0.15s", cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)", fontFamily: "'DM Sans', monospace" }}>
                        {t.id}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--tm)" }}>{t.date}</span>
                    </td>

                    <td style={{ padding: "14px 16px", minWidth: "200px", maxWidth: "260px" }}>
                      <div style={{
                        fontSize: "13px", color: "var(--tp)", fontWeight: 400,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {t.description}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>
                        {t.employee}{t.vendor ? ` · ${t.vendor}` : ""}
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: "100px",
                        background: mc.bg, color: mc.color,
                        border: `1px solid ${mc.border}`,
                        fontSize: "11px", fontWeight: 500,
                      }}>
                        {mc.label}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>
                        {t.amount}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <ScoreBadge score={t.fraudScore} />
                    </td>

                    <td style={{ padding: "14px 16px", minWidth: "140px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {t.flags.length === 0 ? (
                          <span style={{ fontSize: "11px", color: "var(--tm)" }}>—</span>
                        ) : t.flags.map(flag => (
                          <span key={flag} style={{
                            padding: "2px 8px", borderRadius: "100px",
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.15)",
                            fontSize: "10px", color: "#dc2626", fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}>
                            {flag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                        <span style={{
                          padding: "3px 10px", borderRadius: "100px",
                          background: sc.bg, color: sc.color,
                          border: `1px solid ${sc.border}`,
                          fontSize: "11px", fontWeight: 500,
                        }}>
                          {sc.label}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      {t.status !== "auto-approved" && (
                        <button
                          style={{
                            padding: "5px 14px", borderRadius: "8px",
                            border: "1px solid var(--border)",
                            background: "transparent",
                            fontSize: "12px", color: "var(--ts)",
                            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = "var(--em)";
                            e.currentTarget.style.color = "var(--em)";
                            e.currentTarget.style.background = "var(--em-subtle)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.color = "var(--ts)";
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          Review →
                        </button>
                      )}
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
        padding: isMobile ? "12px 16px" : "14px 24px",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "12px", color: "var(--tm)" }}>
          {isMobile
            ? `${filtered.length} / ${mockData.length} transaksi`
            : `Menampilkan ${filtered.length} dari ${mockData.length} transaksi terbaru`
          }
        </span>
        <Link href="/dashboard/expense" style={{
          fontSize: "12px", color: "var(--em)",
          textDecoration: "none", fontWeight: 500,
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          Lihat semua
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}