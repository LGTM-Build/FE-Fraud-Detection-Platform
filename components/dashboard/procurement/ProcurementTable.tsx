"use client";

import { useState } from "react";
import {
  statusConfig, getFraudRiskConfig, type ProcurementTransaction,
} from "@/data/procurement";
import ScoreBar from "@/components/dashboard/procurement/ScoreBar";

const PAGE_SIZE = 10;

interface TableProps {
  data: ProcurementTransaction[];
  onSelect: (tx: ProcurementTransaction) => void;
  isMobile: boolean;
}

// Helper formatter (disamakan dengan Expense)
const fmt = (num: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
const fmtDate = (d: string | Date) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

function MobileList({ data, onSelect, startIdx }: { data: ProcurementTransaction[], onSelect: (tx: ProcurementTransaction) => void, startIdx: number }) {
  return (
    <div>
      {data.map((t, i) => {
        const sc   = statusConfig[t.status] || statusConfig.pending;
        const rowNum = startIdx + i + 1; // Nomor urut

        return (
          <div key={t.id} onClick={() => onSelect(t)}
            style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--em)", fontFamily: "'DM Sans', monospace" }}>
                  #{rowNum}
                </span>
                <span style={{ fontSize: "12px", color: "var(--tm)", marginLeft: "8px" }}>{fmtDate(t.purchaseDate)}</span>
              </div>
              <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "10px", fontWeight: 600 }}>
                {sc.label}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "14px", color: "var(--tp)", fontWeight: 600, marginBottom: "4px" }}>{t.itemDescription}</div>
              <div style={{ fontSize: "12px", color: "var(--ts)" }}>{t.vendorName ?? "—"} • {t.department ?? "—"}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--tp)" }}>{fmt(t.amountTotal)}</div>
              {t.fraudScore !== null && t.fraudScore !== undefined ? (
                <ScoreBar score={t.fraudScore} />
              ) : (
                <span style={{ fontSize: "11px", color: "#6366f1" }}>Menunggu AI...</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ProcurementTable({ data, onSelect, isMobile }: TableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Search Logic
  const q = search.toLowerCase();
  const filtered = q
    ? data.filter(t =>
        t.vendorName.toLowerCase().includes(q) ||
        t.itemDescription.toLowerCase().includes(q) ||
        (t.department ?? "").toLowerCase().includes(q) ||
        (t.employeeName ?? t.requesterName ?? "").toLowerCase().includes(q)
      )
    : data;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visibleData = filtered.slice(start, start + PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  // Header identik dengan Expense Table
  const headers = ["No.", "Tanggal", "Deskripsi", "Pengaju", "Total Nilai", "Fraud Score", "Status", ""];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      
      {/* Search Bar (Khas Procurement) */}
      <div style={{ padding: isMobile ? "10px 14px" : "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input value={search} onChange={e => handleSearch(e.target.value)}
          placeholder="Cari vendor, deskripsi, departemen..."
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

      {visibleData.length === 0 ? (
        <div style={{ padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <div style={{ fontSize: "13px", color: "var(--tm)" }}>Tidak ada transaksi yang cocok {search && <b>dengan "{search}"</b>}</div>
        </div>
      ) : isMobile ? (
        <MobileList data={visibleData} onSelect={onSelect} startIdx={start} />
      ) : (
        <div style={{ overflowX: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                {headers.map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleData.map((t, i) => {
                const sc = statusConfig[t.status] || statusConfig.pending;
                const rowNum = start + i + 1;

                return (
                  <tr key={t.id} onClick={() => onSelect(t)} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                    
                    {/* Kolom Nomor Urut */}
                    <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "var(--em)", width: "40px" }}>
                      {rowNum}
                    </td>
                    
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "var(--ts)", whiteSpace: "nowrap" }}>{fmtDate(t.purchaseDate)}</td>
                    
                    <td style={{ padding: "14px 16px", minWidth: "200px" }}>
                      <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>{t.itemDescription}</div>
                      <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{t.vendorName ?? "—"}</div>
                    </td>
                    
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: "13px", color: "var(--tp)" }}>{t.employeeName ?? t.requesterName ?? "Tanpa Nama"}</div>
                      <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{t.department ?? "—"}</div>
                    </td>
                    
                    <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "var(--tp)", whiteSpace: "nowrap" }}>{fmt(t.amountTotal)}</td>
                    
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      {t.fraudScore !== null && t.fraudScore !== undefined ? (
                        <ScoreBar score={t.fraudScore} />
                      ) : (
                        <span style={{ fontSize: "11px", color: "#6366f1", fontWeight: 600 }}>Menunggu AI...</span>
                      )}
                    </td>
                    
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ padding: "4px 12px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>{sc.label}</span>
                    </td>
                    
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Container Identik dengan Expense */}
      {totalPages > 1 && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "8px", background: "var(--bg)" }}>
          <button disabled={safePage === 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", cursor: safePage === 1 ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
            Sebelumnya
          </button>
          
          <div style={{ display: "flex", alignItems: "center", padding: "0 10px", fontSize: "12px", color: "var(--tm)", fontWeight: 500 }}>
            Hal {safePage} dari {totalPages}
          </div>

          <button disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", cursor: safePage === totalPages ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}