"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Series = { key: string; color: string; name: string };

export function MultiLine({
  data,
  series,
  height = 220,
}: {
  data: Array<Record<string, number>>;
  series: Series[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }} data-testid="multiline-chart">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(140,190,210,0.12)" vertical={false} />
          <XAxis dataKey="t" tick={{ fill: "#8aa0b0", fontSize: 10 }} />
          <YAxis tick={{ fill: "#8aa0b0", fontSize: 10 }} width={36} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0c1a24",
              border: "1px solid rgba(140,190,210,0.25)",
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#8aa0b0" }} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
