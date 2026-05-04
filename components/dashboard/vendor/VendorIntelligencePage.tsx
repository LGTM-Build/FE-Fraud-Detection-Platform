"use client";
import { useState } from "react";

type VendorStatus = "active" | "watchlist" | "blacklisted";

interface VendorRelation {
  employeeName: string;
  employeeRole: string;
  relationType: string;
}

interface Vendor {
  id: string;
  name: string;
  taxId: string;
  registeredDate: string;
  address: string;
  contact: string;
  status: VendorStatus;
  riskScore: number;
  totalTransactions: number;
  totalValue: number;
  flaggedTransactions: number;
  fraudFlags: string[];
  relations: VendorRelation[];
  lastTransaction: string;
  category: string;
  notes: string;
}

const vendors: Vendor[] = [
  {
    id: "VND-001", name: "PT Cepat Untung Mandiri", taxId: "09.012.345.6-789.000",
    registeredDate: "2 Apr 2026", address: "Jl. Palmerah Barat No. 12, Jakarta",
    contact: "021-5551234", status: "blacklisted", riskScore: 94,
    totalTransactions: 3, totalValue: 165000000, flaggedTransactions: 3,
    fraudFlags: ["Shell Company", "Vendor Baru", "Price Markup", "Unverified Address"],
    relations: [
      { employeeName: "Anton Susilo", employeeRole: "Procurement Staff", relationType: "Keluarga (Kakak)" },
    ],
    lastTransaction: "5 Apr 2026", category: "Jasa Kebersihan",
    notes: "Vendor tidak dapat diverifikasi. NPWP tidak aktif di DJP. Alamat fiktif. Semua transaksi di-flag high alert.",
  },
  {
    id: "VND-002", name: "CV Maju Bersama", taxId: "07.891.234.5-678.000",
    registeredDate: "28 Mar 2026", address: "Jl. Raya Serpong No. 45, Tangerang",
    contact: "021-7778899", status: "watchlist", riskScore: 72,
    totalTransactions: 2, totalValue: 37000000, flaggedTransactions: 2,
    fraudFlags: ["Price Markup", "Vendor Baru"],
    relations: [],
    lastTransaction: "12 Apr 2026", category: "Alat Tulis & Perlengkapan",
    notes: "Vendor baru dengan harga markup signifikan. Dalam pengawasan — belum cukup data untuk blacklist.",
  },
  {
    id: "VND-003", name: "UD Stationery Plus", taxId: "01.234.567.8-901.000",
    registeredDate: "15 Jan 2023", address: "Jl. Kemang Raya No. 88, Jakarta Selatan",
    contact: "021-7171234", status: "watchlist", riskScore: 68,
    totalTransactions: 14, totalValue: 52500000, flaggedTransactions: 4,
    fraudFlags: ["Duplicate Invoice", "Self Approval"],
    relations: [
      { employeeName: "Hendra Wijaya", employeeRole: "GA Staff", relationType: "Vendor Langganan (Preferensial)" },
    ],
    lastTransaction: "10 Apr 2026", category: "Alat Tulis & Perlengkapan",
    notes: "Ditemukan pola duplicate invoice berulang. Requester selalu karyawan yang sama. Masuk watchlist untuk monitoring.",
  },
  {
    id: "VND-004", name: "PT Solusi Digital Indonesia", taxId: "03.456.789.0-123.000",
    registeredDate: "12 Feb 2021", address: "Gedung Cyber 2 Lt. 15, Jakarta Selatan",
    contact: "021-5225678", status: "watchlist", riskScore: 55,
    totalTransactions: 6, totalValue: 285000000, flaggedTransactions: 2,
    fraudFlags: ["Bypass Tender", "Self Approval"],
    relations: [],
    lastTransaction: "11 Apr 2026", category: "Jasa IT & Konsultasi",
    notes: "Vendor legitimate namun ada 2 transaksi yang bypass tender. Self-approval ditemukan pada PO terakhir.",
  },
  {
    id: "VND-005", name: "PT Mitra Teknologi Nusantara", taxId: "02.345.678.9-012.000",
    registeredDate: "3 Jun 2019", address: "Jl. TB Simatupang No. 17, Jakarta",
    contact: "021-7834567", status: "active", riskScore: 18,
    totalTransactions: 22, totalValue: 1240000000, flaggedTransactions: 0,
    fraudFlags: [],
    relations: [],
    lastTransaction: "8 Apr 2026", category: "Software & Lisensi",
    notes: "Vendor terpercaya. Track record bersih selama 5 tahun. Semua transaksi melalui tender resmi.",
  },
  {
    id: "VND-006", name: "PT Infrastruktur Andalan", taxId: "04.567.890.1-234.000",
    registeredDate: "20 Aug 2018", address: "Jl. Gatot Subroto No. 99, Jakarta",
    contact: "021-5274321", status: "active", riskScore: 12,
    totalTransactions: 18, totalValue: 890000000, flaggedTransactions: 1,
    fraudFlags: [],
    relations: [],
    lastTransaction: "25 Mar 2026", category: "Fasilitas & Gedung",
    notes: "Vendor lama dan terpercaya. Satu transaksi sempat di-flag karena nominal besar namun sudah diverifikasi.",
  },
];

const statusConfig: Record<VendorStatus, { label: string; bg: string; color: string; border: string; dot: string }> = {
  active:      { label: "Active",      bg: "rgba(16,185,129,0.10)", color: "var(--em)", border: "rgba(16,185,129,0.20)", dot: "#10b981" },
  watchlist:   { label: "Watchlist",   bg: "rgba(245,158,11,0.10)", color: "#d97706", border: "rgba(245,158,11,0.20)", dot: "#f59e0b" },
  blacklisted: { label: "Blacklisted", bg: "rgba(239,68,68,0.10)", color: "#dc2626", border: "rgba(239,68,68,0.20)", dot: "#ef4444" },
};

function fmt(n: number) {
  if (n >= 1000000000) return "Rp " + (n / 1000000000).toFixed(1) + "M";
  if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(0) + "jt";
  return "Rp " + n.toLocaleString("id-ID");
}

function RiskMeter({ score }: { score: number }) {
  const color = score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Medium Risk" : "Low Risk";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <span style={{ fontSize: "11px", color: "var(--tm)" }}>Risk Score</span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden", marginBottom: "4px" }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 0.4s ease" }} />
      </div>
      <div style={{ fontSize: "10px", color, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ─── Vendor Detail Panel ─────────────────────────────────────
function VendorDetail({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) {
  const sc = statusConfig[vendor.status];
  const scoreColor = vendor.riskScore >= 70 ? "#ef4444" : vendor.riskScore >= 40 ? "#f59e0b" : "#10b981";

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: "460px", background: "var(--bg)",
        borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
      }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "11px", color: "var(--em)", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "4px" }}>{vendor.id}</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--tp)", letterSpacing: "-0.3px", marginBottom: "6px", lineHeight: 1.2 }}>
              {vendor.name}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.dot }} />
              <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>
                {sc.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ts)", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Risk score */}
          <div style={{
            padding: "16px 20px", borderRadius: "12px",
            background: vendor.riskScore >= 70 ? "rgba(239,68,68,0.06)" : vendor.riskScore >= 40 ? "rgba(245,158,11,0.06)" : "rgba(16,185,129,0.06)",
            border: `1px solid ${vendor.riskScore >= 70 ? "rgba(239,68,68,0.18)" : vendor.riskScore >= 40 ? "rgba(245,158,11,0.18)" : "rgba(16,185,129,0.18)"}`,
          }}>
            <RiskMeter score={vendor.riskScore} />
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[
              { label: "Total Transaksi", value: vendor.totalTransactions.toString() },
              { label: "Total Nilai", value: fmt(vendor.totalValue) },
              { label: "Di-flag", value: vendor.flaggedTransactions.toString(), alert: vendor.flaggedTransactions > 0 },
            ].map(s => (
              <div key={s.label} style={{ padding: "12px", borderRadius: "10px", background: "var(--surface-2)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "18px", fontWeight: 700, color: s.alert ? "#dc2626" : "var(--tp)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "var(--tm)", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Fraud flags */}
          {vendor.fraudFlags.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Fraud Flags</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {vendor.fraudFlags.map(f => (
                  <span key={f} style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", fontSize: "12px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Relations */}
          {vendor.relations.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
                Relasi Karyawan Internal
              </div>
              {vendor.relations.map((r, i) => (
                <div key={i} style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--tp)" }}>{r.employeeName}</div>
                    <div style={{ fontSize: "11px", color: "var(--tm)" }}>{r.employeeRole}</div>
                    <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: 500, marginTop: "2px" }}>⚠ {r.relationType}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vendor info */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>Info Vendor</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "NPWP", value: vendor.taxId },
                { label: "Terdaftar", value: vendor.registeredDate },
                { label: "Kategori", value: vendor.category },
                { label: "Alamat", value: vendor.address },
                { label: "Kontak", value: vendor.contact },
                { label: "Transaksi Terakhir", value: vendor.lastTransaction },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", gap: "16px" }}>
                  <span style={{ fontSize: "12px", color: "var(--tm)", flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: "12px", color: "var(--ts)", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div style={{ padding: "14px 16px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Catatan Auditor</div>
              <p style={{ fontSize: "13px", color: "var(--ts)", lineHeight: 1.65, fontWeight: 300 }}>{vendor.notes}</p>
            </div>
          )}
        </div>

        {/* Status change actions */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "11px", color: "var(--tm)", marginBottom: "2px" }}>Ubah Status Vendor</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid rgba(16,185,129,0.30)", background: "rgba(16,185,129,0.06)", color: "var(--em)", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              ✓ Active
            </button>
            <button style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid rgba(245,158,11,0.30)", background: "rgba(245,158,11,0.06)", color: "#d97706", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              ⚠ Watchlist
            </button>
            <button style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.30)", background: "rgba(239,68,68,0.06)", color: "#dc2626", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              ✕ Blacklist
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────
type FilterStatus = "all" | VendorStatus;

export default function VendorIntelligencePage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const filtered = vendors.filter(v => {
    if (filterStatus !== "all" && v.status !== filterStatus) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.taxId.includes(search)) return false;
    return true;
  });

  const counts = {
    all: vendors.length,
    active: vendors.filter(v => v.status === "active").length,
    watchlist: vendors.filter(v => v.status === "watchlist").length,
    blacklisted: vendors.filter(v => v.status === "blacklisted").length,
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--tp)", letterSpacing: "-0.8px", marginBottom: "4px" }}>
              Vendor Intelligence
            </h1>
            <p style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
              Profil risiko, relasi, dan riwayat fraud per vendor
            </p>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {[
            { label: "Blacklisted", count: counts.blacklisted, color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.18)" },
            { label: "Watchlist", count: counts.watchlist, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)" },
            { label: "Active", count: counts.active, color: "var(--em)", bg: "var(--em-subtle)", border: "rgba(16,185,129,0.18)" },
          ].map(s => (
            <div key={s.label} style={{ padding: "16px 20px", borderRadius: "14px", background: s.bg, border: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: s.color, fontWeight: 500 }}>{s.label}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "6px" }}>
          {(["all", "active", "watchlist", "blacklisted"] as FilterStatus[]).map(s => {
            const labels: Record<FilterStatus, string> = { all: "Semua", active: "Active", watchlist: "Watchlist", blacklisted: "Blacklisted" };
            const isActive = filterStatus === s;
            const alertColor = s === "blacklisted" ? "#dc2626" : s === "watchlist" ? "#d97706" : "var(--em)";
            return (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px", borderRadius: "10px", border: "none",
                fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 500 : 400, transition: "all 0.15s",
                background: isActive ? "var(--em-subtle-2)" : "transparent",
                color: isActive ? (s === "all" ? "var(--em)" : alertColor) : "var(--tm)",
              }}>
                {labels[s]}
                <span style={{ fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "100px", background: isActive ? "var(--em-subtle)" : "var(--surface-2)", color: isActive ? alertColor : "var(--tm)" }}>
                  {counts[s as keyof typeof counts]}
                </span>
              </button>
            );
          })}

          {/* <div style={{ width: "1px", height: "20px", background: "var(--border)", flexShrink: 0 }} /> */}

          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 12px", height: "34px", borderRadius: "9px", border: "1px solid var(--border)", background: "var(--surface-2)", width: "220px", marginLeft: "auto" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              placeholder="Cari vendor atau NPWP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: "none", background: "transparent", fontSize: "13px", color: "var(--tp)", outline: "none", width: "160px", fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>

        {/* Vendor cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {filtered.map(vendor => {
            const sc = statusConfig[vendor.status];
            const scoreColor = vendor.riskScore >= 70 ? "#ef4444" : vendor.riskScore >= 40 ? "#f59e0b" : "#10b981";
            return (
              <div
                key={vendor.id}
                onClick={() => setSelectedVendor(vendor)}
                style={{
                  background: "var(--card-bg)", border: "1px solid var(--card-b)",
                  borderRadius: "16px", padding: "20px",
                  cursor: "pointer", transition: "transform 0.18s, border-color 0.18s, box-shadow 0.18s",
                  display: "flex", flexDirection: "column", gap: "16px",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--card-b)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "10px", color: "var(--em)", fontWeight: 600, letterSpacing: "0.8px", marginBottom: "3px" }}>{vendor.id}</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--tp)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {vendor.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "2px" }}>{vendor.category}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc.dot }} />
                    <span style={{ padding: "3px 10px", borderRadius: "100px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: "11px", fontWeight: 500 }}>
                      {sc.label}
                    </span>
                  </div>
                </div>

                {/* Risk score mini */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "var(--tm)" }}>Risk Score</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: scoreColor }}>{vendor.riskScore}</span>
                  </div>
                  <div style={{ height: "4px", borderRadius: "2px", background: "var(--border)", overflow: "hidden" }}>
                    <div style={{ width: `${vendor.riskScore}%`, height: "100%", background: scoreColor, borderRadius: "2px" }} />
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {[
                    { label: "Transaksi", value: vendor.totalTransactions.toString() },
                    { label: "Nilai", value: fmt(vendor.totalValue) },
                    { label: "Di-flag", value: vendor.flaggedTransactions.toString(), alert: vendor.flaggedTransactions > 0 },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center", padding: "8px 6px", borderRadius: "8px", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: s.alert ? "#dc2626" : "var(--tp)", fontFamily: "'Syne', sans-serif" }}>{s.value}</div>
                      <div style={{ fontSize: "10px", color: "var(--tm)", marginTop: "2px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Flags preview */}
                {vendor.fraudFlags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {vendor.fraudFlags.slice(0, 2).map(f => (
                      <span key={f} style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", fontSize: "10px", color: "#dc2626", fontWeight: 500 }}>{f}</span>
                    ))}
                    {vendor.fraudFlags.length > 2 && (
                      <span style={{ padding: "2px 8px", borderRadius: "100px", background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: "10px", color: "var(--tm)" }}>
                        +{vendor.fraudFlags.length - 2} lainnya
                      </span>
                    )}
                  </div>
                )}

                {/* Relation warning */}
                {vendor.relations.length > 0 && (
                  <div style={{ padding: "8px 12px", borderRadius: "8px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 500 }}>
                      Conflict of Interest — {vendor.relations[0].relationType}
                    </span>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "11px", color: "var(--tm)" }}>Transaksi terakhir: {vendor.lastTransaction}</span>
                  <span style={{ fontSize: "11px", color: "var(--em)", fontWeight: 500 }}>Lihat profil →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedVendor && <VendorDetail vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
    </>
  );
}