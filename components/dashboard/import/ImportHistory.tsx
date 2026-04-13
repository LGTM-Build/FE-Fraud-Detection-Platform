import { importHistory, statusConfig } from "@/data/imports";

export function ImportHistory() {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Riwayat Import</h3>
        <p style={{ fontSize: "12px", color: "var(--tm)" }}>Semua batch import sebelumnya</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["ID", "File", "Modul", "Diupload oleh", "Waktu", "Baris", "Error", "Durasi", "Status"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {importHistory.map((b, i) => {
              const sc = statusConfig[b.status];
              const isLast = i === importHistory.length - 1;
              return (
                <tr key={b.id} style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--em)" }}>{b.id}</span>
                  </td>
                  <td style={{ padding: "12px 16px", maxWidth: "180px" }}>
                    <div style={{ fontSize: "13px", color: "var(--tp)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      📄 {b.filename}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "var(--em-subtle)", border: "1px solid var(--border)", color: "var(--ts)" }}>
                      {b.module === "expense" ? "Expense" : "Procurement"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", color: "var(--ts)" }}>{b.uploadedBy}</span>
                  </td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "12px", color: "var(--tm)" }}>{b.uploadedAt}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", color: "var(--tp)", fontWeight: 500 }}>{b.totalRows.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", color: b.errorRows > 0 ? "#dc2626" : "var(--tm)", fontWeight: b.errorRows > 0 ? 600 : 400 }}>
                      {b.errorRows}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", color: "var(--tm)" }}>{b.duration}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.dot }} />
                      <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {sc.label}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}