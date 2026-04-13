import { Step, STEP_LABELS, STEP_ORDER } from "@/data/imports";

interface StepIndicatorProps {
  currentStep: Step;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIdx = STEP_ORDER.indexOf(currentStep);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {STEP_ORDER.map((s, i) => {
        const isDone = currentIdx > i;
        const isCurrent = currentStep === s;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEP_ORDER.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: isDone || isCurrent ? "var(--em)" : "var(--surface-2)",
                border: `2px solid ${isDone || isCurrent ? "var(--em)" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
              }}>
                {isDone
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontSize: "11px", fontWeight: 700, color: isCurrent ? "#fff" : "var(--tm)" }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: "12px", fontWeight: isCurrent ? 500 : 400, color: isCurrent ? "var(--em)" : isDone ? "var(--ts)" : "var(--tm)", whiteSpace: "nowrap" }}>
                {STEP_LABELS[s]}
              </span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div style={{ flex: 1, height: "2px", margin: "0 12px", background: isDone ? "var(--em)" : "var(--border)", borderRadius: "1px", transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}