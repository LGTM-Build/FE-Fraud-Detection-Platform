import { policyRules, fmt } from "@/components/dashboard/settings/types";

interface PolicyTabProps { isMobile?: boolean; }

function PolicyCard({ rule }: { rule: typeof policyRules[0] }) {
  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>{rule.category}</span>
          <span style={{ fontSize: "11px", color: "var(--tm)", marginLeft: "8px" }}>{rule.grade}</span>
        </div>
        <button style={{ padding: "4px 10px", borderRadius: "7px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div style={{ padding: "8px 10px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", color: "var(--tm)", marginBottom: "2px" }}>Per Klaim</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>{fmt(rule.limitPerClaim)}</div>
        </div>
        <div style={{ padding: "8px 10px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "10px", color: "var(--tm)", marginBottom: "2px" }}>Per Bulan</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)" }}>{fmt(rule.limitPerMonth)}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <span style={{ fontSize: "11px", color: rule.requireReceipt ? "var(--em)" : "var(--tm)", fontWeight: rule.requireReceipt ? 500 : 400 }}>
          {rule.requireReceipt ? "✓ Wajib Struk" : "— Tanpa Struk"}
        </span>
        <span style={{ fontSize: "11px", color: "var(--border)" }}>·</span>
        <span style={{ fontSize: "11px", color: rule.requireApproval ? "var(--em)" : "var(--tm)", fontWeight: rule.requireApproval ? 500 : 400 }}>
          {rule.requireApproval ? "✓ Wajib Approval" : "— Tanpa Approval"}
        </span>
      </div>
    </div>
  );
}

export function PolicyTab({ isMobile }: PolicyTabProps) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
      <div style={{ padding: isMobile ? "14px 16px" : "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: "10px" }}>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>Policy Rules</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Batas klaim expense per kategori dan jabatan — digunakan AI untuk deteksi out-of-policy</p>
        </div>
        <button style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Tambah Rule
        </button>
      </div>

      {isMobile ? (
        <div>{policyRules.map(rule => <PolicyCard key={rule.id} rule={rule} />)}</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Kategori", "Jabatan", "Limit / Klaim", "Limit / Bulan", "Wajib Struk", "Wajib Approval", ""].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--surface-2)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policyRules.map((rule, i) => (
                <tr key={rule.id} style={{ borderBottom: i < policyRules.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{rule.category}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: "var(--ts)" }}>{rule.grade}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "13px", color: "var(--tp)", fontWeight: 500 }}>{fmt(rule.limitPerClaim)}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "13px", color: "var(--ts)" }}>{fmt(rule.limitPerMonth)}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: rule.requireReceipt ? "var(--em)" : "var(--tm)", fontWeight: rule.requireReceipt ? 500 : 400 }}>{rule.requireReceipt ? "✓ Ya" : "— Tidak"}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ fontSize: "12px", color: rule.requireApproval ? "var(--em)" : "var(--tm)", fontWeight: rule.requireApproval ? 500 : 400 }}>{rule.requireApproval ? "✓ Ya" : "— Tidak"}</span></td>
                  <td style={{ padding: "12px 16px" }}><button style={{ padding: "4px 12px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", fontSize: "11px", color: "var(--ts)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}