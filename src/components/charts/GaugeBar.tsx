"use client";

export function GaugeBar({
  label,
  value,
  max,
  unit,
  warnAt,
  alertAt,
  testId,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  warnAt?: number;
  alertAt?: number;
  testId?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  let tone: "ok" | "warn" | "alert" = "ok";
  if (alertAt !== undefined && value >= alertAt) tone = "alert";
  else if (warnAt !== undefined && value >= warnAt) tone = "warn";

  return (
    <div className={`gauge tone-${tone}`} data-testid={testId}>
      <div className="gauge-head">
        <span>{label}</span>
        <strong>
          {value}
          {unit}
        </strong>
      </div>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
