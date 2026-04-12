import { mockMappingResult } from "@/data/imports";

// ─── Processing ──────────────────────────────────────────────

export function ProcessingStep() {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "64px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
      <div
        className="spin"
        style={{ width: "56px", height: "56px", borderRadius: "50%", border: "3px solid var(--border)", borderTop: "3px solid var(--em)", display: "inline-block" }}
      />
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", marginBottom: "8px" }}>
          AI sedang menganalisis...
        </div>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
          Isolation Forest dan LLM sedang memproses {mockMappingResult.totalRows} transaksi
        </p>
      </div>
      <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
        {["Mapping kolom", "Deteksi anomali", "Generate fraud score"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--tm)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === 1 ? "var(--em)" : "var(--border)" }} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Done ────────────────────────────────────────────────────

interface DoneStepProps {
  onReset: () => void;
}

export function DoneStep({ onReset }: DoneStepProps) {
  const stats = [
    { label: "Total Diproses", val: "342", color: "var(--tp)" },
    { label: "Auto Approved",  val: "287", color: "var(--em)" },
    { label: "Perlu Review",   val: "43",  color: "#f59e0b"   },
  ];

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", padding: "48px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--em-subtle-2)", border: "1px solid rgba(16,185,129,0.30)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--tp)", marginBottom: "8px" }}>Import Selesai!</div>
        <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>342 transaksi berhasil diproses — 43 di-flag untuk review</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", width: "100%", maxWidth: "400px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ padding: "12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: "10px", color: "var(--tm)", marginTop: "3px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <a href="/dashboard/expense" style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, textDecoration: "none", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
          Lihat Hasil Review →
        </a>
        <button onClick={onReset} style={{ padding: "10px 20px", borderRadius: "10px", border: "1px solid var(--border)", background: "transparent", color: "var(--ts)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Import File Lain
        </button>
      </div>
    </div>
  );
}