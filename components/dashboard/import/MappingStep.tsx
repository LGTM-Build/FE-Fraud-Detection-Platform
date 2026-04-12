import { mockMappingResult } from "@/data/imports";

interface MappingStepProps {
  uploadedFile: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MappingStep({ uploadedFile, onConfirm, onCancel }: MappingStepProps) {
  const { mappings, detectedSource, totalRows } = mockMappingResult;
  const mapped   = mappings.filter((m) => m.status === "mapped").length;
  const review   = mappings.filter((m) => m.status === "review").length;
  const unmapped = mappings.filter((m) => m.status === "unmapped").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Info bar */}
      <div style={{ background: "var(--em-subtle)", border: "1px solid rgba(16,185,129,0.20)", borderRadius: "12px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <div>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--em)" }}>File terdeteksi: {detectedSource}</span>
          <span style={{ fontSize: "12px", color: "var(--ts)", marginLeft: "12px" }}>{uploadedFile} · {totalRows} baris</span>
        </div>
      </div>

      {/* Mapping table */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Hasil Auto-Mapping AI</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Periksa dan konfirmasi mapping kolom sebelum proses dilanjutkan</p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Kolom CSV Asli", "→ Field Fradara", "Confidence", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mappings.map((m, i) => {
                const isLast = i === mappings.length - 1;
                const confColor = m.confidence >= 80 ? "var(--em)" : m.confidence >= 50 ? "#d97706" : "var(--tm)";
                const statusStyle =
                  m.status === "mapped"   ? { bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", label: "Mapped" }
                  : m.status === "review" ? { bg: "rgba(245,158,11,0.10)",  color: "#d97706",   border: "rgba(245,158,11,0.20)", label: "Perlu Review" }
                  :                         { bg: "var(--surface-2)",        color: "var(--tm)", border: "var(--border)",         label: "Tidak Dipetakan" };
                return (
                  <tr key={m.sourceCol} style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "13px", fontFamily: "monospace", color: "var(--tp)", fontWeight: 500 }}>{m.sourceCol}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {m.targetField
                        ? <span style={{ fontSize: "13px", color: "var(--em)", fontFamily: "monospace" }}>{m.targetField}</span>
                        : <span style={{ fontSize: "12px", color: "var(--tm)", fontStyle: "italic" }}>— tidak dipetakan</span>
                      }
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {m.confidence > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "48px", height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden" }}>
                            <div style={{ width: `${m.confidence}%`, height: "100%", background: confColor, borderRadius: "2px" }} />
                          </div>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: confColor }}>{m.confidence}%</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                        {statusStyle.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
            <span style={{ color: "var(--em)" }}>✓ {mapped} mapped</span>
            <span style={{ color: "#d97706" }}>⚠ {review} perlu review</span>
            <span style={{ color: "var(--tm)" }}>— {unmapped} tidak dipetakan</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onCancel} style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Batal
            </button>
            <button onClick={onConfirm} style={{ padding: "9px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
              Konfirmasi & Proses →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}