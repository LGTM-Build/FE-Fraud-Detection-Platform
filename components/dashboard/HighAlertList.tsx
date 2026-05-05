"use client";
import { useRouter } from "next/navigation";

function HighAlertRow({ item, isLast }: { item: any; isLast: boolean }) {
  const router = useRouter();

  const formattedAmount = item.amountTotal 
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(item.amountTotal))
    : "Rp 0";

  const displayCode = item.code || (item.id ? item.id.slice(0, 8) : "—");
  
  // Menggunakan 'title' dari Backend (dengan fallback ke description jika kosong)
  const displayTitle = item.title ?? item.description ?? "Tanpa Judul";

  const handleRowClick = () => {
    // Deteksi jenis modul untuk menentukan halaman tujuan
    const moduleType = (item.module || item.type || "").toLowerCase();
    const isProcurement = moduleType.includes("procurement") || moduleType.includes("pengadaan");
    
    // Arahkan user ke halaman yang sesuai
    const targetPage = isProcurement ? "/dashboard/procurement" : "/dashboard/expense";
    router.push(targetPage);
  };

  return (
    <div 
      onClick={handleRowClick}
      style={{
        padding: "12px 16px", borderBottom: isLast ? "none" : "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", transition: "background 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--em-subtle)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
    >
      {/* Box Skor Fraud */}
      <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626" }}>
          {item.score ?? item.fraudScore}
        </span>
      </div>

      {/* Info Transaksi */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--tp)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "3px" }}>
          {displayTitle}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: "var(--em)", fontWeight: 600, fontFamily: "'DM Sans', monospace" }}>{displayCode}</span>
          <span style={{ fontSize: "10px", color: "var(--tm)" }}>·</span>
          <span style={{ fontSize: "11px", color: "var(--ts)", fontWeight: 500 }}>{formattedAmount}</span>
        </div>
      </div>

      {/* Icon Panah Navigasi */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

export default function HighAlertList({ data }: { data: any[] }) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "420px" }}>
      
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.2px", marginBottom: "2px" }}>
            Prioritas Review
          </h3>
          <p style={{ fontSize: "12px", color: "var(--tm)" }}>Perlu tindakan segera</p>
        </div>
        <span style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", fontSize: "11px", color: "#dc2626", fontWeight: 600 }}>
          {data.length} kasus
        </span>
      </div>

      {/* List Transaksi */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {data.length === 0 ? (
           <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--tm)", fontSize: "13px" }}>
              Wah, kabar baik! Tidak ada transaksi mencurigakan saat ini.
           </div>
        ) : (
          data.map((item, i) => (
            <HighAlertRow 
              key={item.id} 
              item={item} 
              isLast={i === data.length - 1} 
            />
          ))
        )}
      </div>
      
    </div>
  );
}