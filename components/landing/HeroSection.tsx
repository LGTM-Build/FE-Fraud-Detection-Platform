'use client';

export default function HeroSection() {
  const marqueeItems = [
    "Expense Fraud Detection", "Procurement Intelligence", "Smart CSV Mapper",
    "Vendor Watchlist", "AI Audit Report", "Isolation Forest",
    "Conflict of Interest Graph", "LKPP e-Katalog Benchmark",
  ];
  const allItems = [...marqueeItems, ...marqueeItems];

  return (
    <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 64px 0 64px", textAlign: "center" }}>

      {/* Badge */}
      <div className="glass" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "7px 10px 7px 10px", borderRadius: "100px", marginBottom: "40px" }}>
        {/* <span style={{ padding: "4px 12px", borderRadius: "100px", background: "linear-gradient(135deg,var(--em-deep),var(--em))", color: "var(--btn-pri-c)", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>AI · 2026</span> */}
        <span className="blink" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--em)", marginLeft: "2px", flexShrink: 0 }}/>
        <span style={{ fontSize: "12px", color: "var(--ts)", letterSpacing: "0.2px" }}>Platform fraud detection #1 untuk bisnis Indonesia</span>
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(56px,9vw,118px)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-4px", color: "var(--tp)", marginBottom: "32px", maxWidth: "1080px" }}>
        Deteksi Fraud
        <br />
        <span className="grad-text">Sebelum</span>
        <br />
        <span className="stroke-text">Terlambat.</span>
      </h1>

      {/* Sub */}
      <p style={{ fontSize: "clamp(15px,1.8vw,19px)", fontWeight: 300, color: "var(--ts)", lineHeight: 1.65, maxWidth: "560px", margin: "0 auto 52px", letterSpacing: "0.1px" }}>
        Upload CSV dari SAP, Odoo, atau Excel — AI Fradara langsung analisis ribuan transaksi, beri fraud score, dan hasilkan laporan audit dalam hitungan menit. Bukan jam.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", flexWrap: "wrap", marginBottom: "72px" }}>
        <a href="#demo" className="btn-primary" style={{ fontSize: "15px", padding: "16px 34px" }}>
          Mulai Analisis Gratis
          <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </a>
        <a href="#how-it-works" className="btn-ghost" style={{ fontSize: "15px", padding: "16px 34px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Tonton Demo ↗
        </a>
      </div>

      {/* Stats strip */}
      {/* <div className="glass" style={{ display: "flex", alignItems: "stretch", borderRadius: "20px", overflow: "hidden", marginBottom: "72px", maxWidth: "700px", width: "100%" }}>
        {[
          { val: "Rp 2,4M", lbl: "Rata-rata fraud diblokir / perusahaan" },
          { val: "98,3%",   lbl: "Akurasi deteksi Isolation Forest AI" },
          { val: "< 2 mnt", lbl: "Waktu analisis per batch CSV" },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "22px 28px", display: "flex", flexDirection: "column", gap: "4px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "26px", fontWeight: 800, lineHeight: 1, color: "var(--em)" }}>{s.val}</span>
            <span style={{ fontSize: "11px", color: "var(--tm)", letterSpacing: "0.2px" }}>{s.lbl}</span>
          </div>
        ))}
      </div> */}

      {/* Marquee */}
      <div style={{ width: "100vw", overflow: "hidden", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "14px 0", position: "relative", marginBottom: "80px" }}>
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "120px", background: "linear-gradient(90deg,var(--bg),transparent)", zIndex: 2, pointerEvents: "none" }}/>
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "120px", background: "linear-gradient(-90deg,var(--bg),transparent)", zIndex: 2, pointerEvents: "none" }}/>
        <div className="marquee-track" style={{ display: "flex", width: "max-content" }}>
          {allItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 36px", whiteSpace: "nowrap", fontSize: "13px", fontWeight: 400, color: "var(--tm)", letterSpacing: "0.2px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--em)", opacity: 0.6, flexShrink: 0 }}/>
              {item}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}