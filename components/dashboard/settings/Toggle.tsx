export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: "36px", height: "20px", borderRadius: "100px", background: value ? "var(--em)" : "var(--border)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "2px", left: value ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
    </div>
  );
}