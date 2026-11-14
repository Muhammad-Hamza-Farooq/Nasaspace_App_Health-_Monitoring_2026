"use client";

import type { FocusZone } from "@/lib/pulse/store";
import { usePulse } from "@/lib/pulse/store";

export function Zone({
  id,
  code,
  title,
  children,
  className = "",
  as: Tag = "section",
}: {
  id: FocusZone;
  code: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  as?: "section" | "aside" | "div";
}) {
  const { focusZone, demoActive } = usePulse();
  const active = demoActive && focusZone === id;

  return (
    <Tag
      className={`zone ${className} ${active ? "zone-focus" : ""}`}
      data-zone={id}
      data-focus={active ? "true" : "false"}
      aria-label={`${code} ${title}`}
    >
      <div className="zone-label">
        <span className="zone-code">{code}</span>
        <span className="zone-title">{title}</span>
        {active && <span className="zone-now">LOOK HERE</span>}
      </div>
      <div className="zone-body">{children}</div>
    </Tag>
  );
}
