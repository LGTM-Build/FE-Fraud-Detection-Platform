import styles from "@/app/(auth)/register/register.module.css";

type StepIndicatorProps = {
  step: 1 | 2;
};

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className={styles.stepIndicatorWrap}>
      {([1, 2] as const).map((s) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            className={`${styles.stepDot} ${
              step >= s ? styles.stepDotActive : styles.stepDotInactive
            }`}
          >
            {step > s ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span
                className={styles.stepNumber}
                style={{ color: step === s ? "#fff" : "var(--tm)" }}
              >
                {s}
              </span>
            )}
          </div>

          {s < 2 && (
            <div
              className={styles.stepConnector}
              style={{ background: step > s ? "var(--em)" : "var(--border)" }}
            />
          )}
        </div>
      ))}

      <span style={{ fontSize: "12px", color: "var(--tm)", marginLeft: "4px", fontWeight: 300 }}>
        Langkah {step} dari 2
      </span>
    </div>
  );
}