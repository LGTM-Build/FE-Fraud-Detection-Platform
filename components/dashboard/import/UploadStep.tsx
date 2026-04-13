import { useRef } from "react";
import { ImportModule } from "@/data/imports";

interface UploadStepProps {
  selectedModule: ImportModule;
  dragOver: boolean;
  onModuleChange: (m: ImportModule) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SUPPORTED_FORMATS = [
  { src: "SAP / SAP Concur",  icon: "🏢" },
  { src: "Odoo Export",       icon: "🟣" },
  { src: "Accurate Online",   icon: "🔵" },
  { src: "Jurnal.id",         icon: "📊" },
  { src: "Talenta / Gadjian", icon: "👥" },
  { src: "Excel Manual",      icon: "📋" },
];

export function UploadStep({
  selectedModule,
  dragOver,
  onModuleChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>

      {/* Left: module selector + drop zone */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Module selector */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "16px 20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--tm)", marginBottom: "10px" }}>Pilih Modul</div>
          <div style={{ display: "flex", gap: "8px" }}>
            {(["expense", "procurement"] as ImportModule[]).map((m) => (
              <button
                key={m}
                onClick={() => onModuleChange(m)}
                style={{
                  flex: 1, padding: "10px 16px", borderRadius: "10px", border: "none",
                  fontSize: "13px", fontWeight: selectedModule === m ? 500 : 400,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s",
                  background: selectedModule === m ? "var(--em-subtle-2)" : "var(--surface-2)",
                  color: selectedModule === m ? "var(--em)" : "var(--ts)",
                  outline: selectedModule === m ? "1px solid rgba(16,185,129,0.30)" : "1px solid var(--border)",
                }}
              >
                {m === "expense" ? "📄 Expense" : "📦 Procurement"}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--em)" : "var(--border)"}`,
            borderRadius: "16px",
            padding: "52px 32px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            background: dragOver ? "var(--em-subtle)" : "var(--surface-2)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
          }}
        >
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={onFileChange} />
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "var(--em-subtle-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--tp)", marginBottom: "6px" }}>
              Drag & drop file CSV di sini
            </div>
            <div style={{ fontSize: "13px", color: "var(--tm)", fontWeight: 300 }}>
              atau <span style={{ color: "var(--em)", fontWeight: 500 }}>klik untuk browse</span>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "var(--tm)", marginTop: "4px" }}>
            Mendukung .csv, .xlsx, .xls — maks. 50MB
          </div>
        </div>
      </div>

      {/* Right: tips panel */}
      <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-b)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 700, color: "var(--tp)" }}>Format yang Didukung</div>
        {SUPPORTED_FORMATS.map((f) => (
          <div key={f.src} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>{f.icon}</span>
            <span style={{ fontSize: "13px", color: "var(--ts)" }}>{f.src}</span>
            <svg style={{ marginLeft: "auto" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        ))}
        <div style={{ height: "1px", background: "var(--border)" }} />
        <div style={{ padding: "12px", borderRadius: "10px", background: "var(--em-subtle)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "11px", color: "var(--em)", fontWeight: 600, marginBottom: "4px" }}>💡 Tips</div>
          <p style={{ fontSize: "12px", color: "var(--ts)", lineHeight: 1.6, fontWeight: 300 }}>
            Format apapun akan dikenali otomatis oleh Smart CSV Mapper. Tidak perlu ubah nama kolom sebelum upload.
          </p>
        </div>
      </div>
    </div>
  );
}