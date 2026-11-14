"use client";

import { Cell, Pie, PieChart } from "recharts";

type InspectionResult = {
  name: string;
  value: number;
  fill: string;
};

export function WorkspacePieChart({ data }: { data: InspectionResult[] }) {
  return (
    <PieChart responsive style={{ width: "100%", height: "100%", aspectRatio: 1 }}>
      <Pie
        data={data}
        dataKey="value"
        innerRadius="80%"
        outerRadius="100%"
        cornerRadius={3}
        minAngle={1}
        paddingAngle={2}
        isAnimationActive={false}
      >
        {data.map((result) => (
          <Cell
            fill={result.fill}
            key={result.name}
            stroke="var(--card)"
            strokeLinecap="round"
            strokeWidth={1}
          />
        ))}
      </Pie>
    </PieChart>
  );
}
