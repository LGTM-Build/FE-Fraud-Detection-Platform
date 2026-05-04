interface IntegrationsTabProps { isMobile?: boolean; }

const ERP_LIST = [
  { name: "SAP / SAP Concur", desc: "Auto-import expense & PO dari SAP",              connected: true,  icon: "🏢" },
  { name: "Odoo",             desc: "Sinkronisasi transaksi Odoo secara berkala",       connected: false, icon: "🟣" },
  { name: "Accurate Online",  desc: "Import jurnal & faktur dari Accurate",             connected: false, icon: "🔵" },
  { name: "Jurnal.id",        desc: "Hubungkan akun Jurnal.id via OAuth",               connected: false, icon: "📊" },
  { name: "Talenta",          desc: "Import data expense karyawan dari Talenta",        connected: false, icon: "👥" },
];

export function IntegrationsTab({ isMobile }: IntegrationsTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* API Key */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: isMobile ? "16px" : "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>API Key</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Gunakan API key ini untuk integrasi langsung dari sistem ERP</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: isMobile ? "wrap" : "nowrap" }}>
          <div style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", fontFamily: "monospace", fontSize: "13px", color: "var(--ts)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
            frd_live_sk_••••••••••••••••••••••••••••••••
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>Tampilkan</button>
            <button style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>Regenerate</button>
          </div>
        </div>
      </div>

      {/* ERP integrations */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ padding: isMobile ? "14px 16px" : "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "2px" }}>Integrasi ERP</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Hubungkan langsung ke sistem ERP untuk auto-import</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ERP_LIST.map((erp, i) => (
            <div key={erp.name} style={{ padding: isMobile ? "12px 16px" : "16px 20px", borderBottom: i < ERP_LIST.length - 1 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "20px", flexShrink: 0 }}>{erp.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)", marginBottom: "2px" }}>{erp.name}</div>
                {!isMobile && <div style={{ fontSize: "12px", color: "var(--tm)" }}>{erp.desc}</div>}
              </div>
              {erp.connected ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--em)", fontWeight: 500 }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)" }} />
                    {!isMobile && "Terhubung"}
                  </span>
                  <button style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>Putuskan</button>
                </div>
              ) : (
                <button style={{ padding: "7px 14px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ts)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--em)"; e.currentTarget.style.color = "var(--em)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ts)"; }}
                >
                  Hubungkan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Webhook */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: isMobile ? "16px" : "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)", marginBottom: "3px" }}>Webhook</h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Kirim event ke endpoint eksternal saat transaksi di-flag</p>
        </div>
        <div>
          <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px" }}>Endpoint URL</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
            <input placeholder="https://your-system.com/webhook/fradara" style={{ flex: 1, padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", minWidth: 0 }} />
            <button style={{ padding: "9px 16px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
}