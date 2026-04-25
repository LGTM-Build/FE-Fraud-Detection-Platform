import { reportHistory, typeLabels } from "@/data/reports";

interface ReportHistoryProps { isMobile?: boolean; }

// Mobile card per report entry
function HistoryCard({ r }: { r: typeof reportHistory[0] }) {
  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Row 1: ID + format badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--em)" }}>{r.id}</span>
        <span style={{
          padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: 500,
          background: r.format === "pdf" ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
          border: `1px solid ${r.format === "pdf" ? "rgba(239,68,68,0.18)" : "rgba(16,185,129,0.18)"}`,
          color: r.format === "pdf" ? "#dc2626" : "var(--em)",
        }}>
          {r.format.toUpperCase()}
        </span>
      </div>

      {/* Row 2: name + type */}
      <div>
        <div style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 400, marginBottom: "3px" }}>{r.name}</div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ padding: "2px 8px", borderRadius: "100px", fontSize: "10px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>{typeLabels[r.type]}</span>
          <span style={{ fontSize: "11px", color: "var(--tm)" }}>{r.period}</span>
        </div>
      </div>

      {/* Row 3: meta + download */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--tm)" }}>{r.generatedBy}</div>
          <div style={{ fontSize: "11px", color: "var(--tm)" }}>{r.generatedAt} · {r.size}</div>
        </div>
        <button style={{
          padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--em)",
          background: "var(--em-subtle)", fontSize: "12px", color: "var(--em)",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          display: "flex", alignItems: "center", gap: "5px",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Unduh
        </button>
      </div>
    </div>
  );
}

export function ReportHistory({ isMobile }: ReportHistoryProps) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: isMobile ? "14px 16px" : "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Riwayat Laporan</h3>
        <p style={{ fontSize: "12px", color: "var(--tm)" }}>Laporan yang pernah digenerate</p>
      </div>

      {isMobile ? (
        // Mobile: card list
        <div>
          {reportHistory.map(r => <HistoryCard key={r.id} r={r} />)}
        </div>
      ) : (
        // Desktop: table
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Nama Laporan", "Jenis", "Periode", "Format", "Dibuat oleh", "Waktu", "Ukuran", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportHistory.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < reportHistory.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{r.id}</span></td>
                  <td style={{ padding: "12px 16px", maxWidth: "200px" }}>
                    <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>{typeLabels[r.type]}</span>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}><span style={{ fontSize: "12px", color: "var(--tm)" }}>{r.period}</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500,
                      background: r.format === "pdf" ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                      border: `1px solid ${r.format === "pdf" ? "rgba(239,68,68,0.18)" : "rgba(16,185,129,0.18)"}`,
                      color: r.format === "pdf" ? "#dc2626" : "var(--em)",
                    }}>{r.format.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: "var(--ts)" }}>{r.generatedBy}</span></td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}><span style={{ fontSize: "12px", color: "var(--tm)" }}>{r.generatedAt}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: "var(--tm)" }}>{r.size}</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={{ padding: "5px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "12px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "5px", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--em)"; e.currentTarget.style.color = "var(--em)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ts)"; }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Unduh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}