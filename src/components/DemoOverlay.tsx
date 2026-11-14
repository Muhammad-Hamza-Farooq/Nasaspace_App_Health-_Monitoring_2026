"use client";

import { usePulse } from "@/lib/pulse/store";

const TOTAL_STEPS = 8;

export function DemoOverlay() {
  const {
    demoActive,
    demoIndex,
    demoTitle,
    demoCaption,
    startDemo,
    stopDemo,
    nextDemoStep,
  } = usePulse();

  if (!demoActive && !demoTitle) {
    return null;
  }

  if (!demoActive && demoTitle === "Demo complete") {
    return (
      <div className="demo-bar done" data-testid="demo-complete">
        <div>
          <strong>{demoTitle}</strong>
          <p>{demoCaption}</p>
        </div>
        <button type="button" className="btn" onClick={startDemo}>
          Replay demo
        </button>
      </div>
    );
  }

  if (!demoActive) return null;

  return (
    <div className="demo-bar" data-testid="demo-overlay" role="status">
      <div className="demo-progress">
        <span>
          DEMO {demoIndex + 1}/{TOTAL_STEPS}
        </span>
        <div className="demo-track">
          <div
            className="demo-fill"
            style={{ width: `${((demoIndex + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
      <div className="demo-copy">
        <strong data-testid="demo-title">{demoTitle}</strong>
        <p data-testid="demo-caption">{demoCaption}</p>
      </div>
      <div className="demo-actions">
        <button type="button" className="btn" data-testid="demo-next" onClick={nextDemoStep}>
          Next
        </button>
        <button type="button" className="btn ghost" data-testid="demo-stop" onClick={stopDemo}>
          Exit
        </button>
      </div>
    </div>
  );
}
