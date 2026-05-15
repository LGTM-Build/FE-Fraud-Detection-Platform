"use client";

interface ScoreBadgeProps {
  score?: number | null;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  // Kondisi jika AI belum selesai memproses
  if (score === null || score === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "var(--surface-2)" }} />
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)" }}>Menunggu</span>
      </div>
    );
  }

  // Tentukan warna berdasarkan skala 1-100
  let color = "#10b981"; // Hijau (Aman: 0-39)
  if (score >= 70) {
    color = "#dc2626"; // Merah (Bahaya: 70-100)
  } else if (score >= 40) {
    color = "#f59e0b"; // Kuning (Waspada: 40-69)
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "var(--surface-2)", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color: color, fontFamily: "'DM Sans', monospace" }}>
        {score}
      </span>
    </div>
  );
}