"use client";

import { usePulse } from "@/lib/pulse/store";

const TOTAL_STEPS = 9;

export function DemoOverlay() {
  const {
    demoActive,
    demoPaused,
    demoIndex,
    demoTitle,
    demoCaption,
    demoLookAt,
    startDemo,
    stopDemo,
    toggleDemoPause,
    nextDemoStep,
  } = usePulse();

  if (!demoActive && !demoTitle) return null;

  if (!demoActive && (demoTitle === "Mission complete" || demoTitle === "Demo complete")) {
    return (
      <div className="demo-bar done" data-testid="demo-complete">
        <div>
          <strong>{demoTitle}</strong>
          <p>{demoCaption}</p>
        </div>
        <button type="button" className="btn accent" onClick={startDemo}>
          Replay mission
        </button>
      </div>
    );
  }

  if (!demoActive) return null;

  return (
    <div
      className={`demo-bar ${demoPaused ? "paused" : ""}`}
      data-testid="demo-overlay"
      role="status"
      aria-live="polite"
    >
      <div className="demo-progress">
        <span>
          {demoPaused ? "PAUSED" : "MISSION"} {demoIndex + 1}/{TOTAL_STEPS}
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
        <p className="demo-look" data-testid="demo-look">
          {demoLookAt}
        </p>
      </div>
      <div className="demo-actions">
        <button
          type="button"
          className={demoPaused ? "btn accent" : "btn"}
          data-testid="demo-pause"
          onClick={toggleDemoPause}
        >
          {demoPaused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          className="btn"
          data-testid="demo-next"
          onClick={nextDemoStep}
          title="Skip to next beat"
        >
          Next
        </button>
        <button
          type="button"
          className="btn danger"
          data-testid="demo-stop"
          onClick={stopDemo}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
