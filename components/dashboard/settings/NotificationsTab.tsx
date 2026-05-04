import { Toggle } from "@/components/dashboard/settings/Toggle";

interface NotificationsTabProps {
  emailAlert: boolean; setEmailAlert: (v: boolean) => void;
  waAlert: boolean; setWaAlert: (v: boolean) => void;
  dailyDigest: boolean; setDailyDigest: (v: boolean) => void;
  highAlertOnly: boolean; setHighAlertOnly: (v: boolean) => void;
}

export function NotificationsTab({ emailAlert, setEmailAlert, waAlert, setWaAlert, dailyDigest, setDailyDigest, highAlertOnly, setHighAlertOnly }: NotificationsTabProps) {
  const opts = [
    { label: "Email Alert",    desc: "Kirim notifikasi ke email saat ada transaksi high-alert baru", value: emailAlert,    onChange: setEmailAlert },
    { label: "WhatsApp Alert", desc: "Kirim pesan WhatsApp ke nomor yang terdaftar (beta)",          value: waAlert,       onChange: setWaAlert },
    { label: "Daily Digest",   desc: "Ringkasan harian dikirim setiap pukul 08.00",                  value: dailyDigest,   onChange: setDailyDigest },
    { label: "High Alert Only",desc: "Hanya kirim notifikasi untuk fraud score > 70",                value: highAlertOnly, onChange: setHighAlertOnly },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "560px" }}>
      {opts.map(opt => (
        <div key={opt.label} style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--tp)", marginBottom: "3px" }}>{opt.label}</div>
            <div style={{ fontSize: "12px", color: "var(--tm)", fontWeight: 300 }}>{opt.desc}</div>
          </div>
          <Toggle value={opt.value} onChange={opt.onChange} />
        </div>
      ))}

      {emailAlert && (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--tm)", textTransform: "uppercase", letterSpacing: "0.8px" }}>Konfigurasi Email</div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "6px" }}>Penerima Alert</div>
            <input defaultValue="audit@company.id, cfo@company.id" style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--tp)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
            <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>Pisahkan dengan koma untuk beberapa email</div>
          </div>
        </div>
      )}

      <button style={{ padding: "11px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--em), var(--em2))", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
        Simpan Pengaturan Notifikasi
      </button>
    </div>
  );
}