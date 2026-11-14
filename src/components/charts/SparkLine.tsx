"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { t: number; v: number };

export function SparkLine({
  data,
  color = "#2ec4b6",
  unit = "",
  height = 120,
  domain,
}: {
  data: Point[];
  color?: string;
  unit?: string;
  height?: number;
  domain?: [number | "auto", number | "auto"];
}) {
  return (
    <div style={{ width: "100%", height }} data-testid="sparkline">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(140,190,210,0.12)" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            domain={domain ?? ["auto", "auto"]}
            width={36}
            tick={{ fill: "#8aa0b0", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0c1a24",
              border: "1px solid rgba(140,190,210,0.25)",
              borderRadius: 0,
              fontSize: 12,
            }}
            labelFormatter={(t) => `t=${t}`}
            formatter={(value) => [`${value}${unit}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            fill={`url(#g-${color.replace("#", "")})`}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
