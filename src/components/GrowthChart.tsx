"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea
} from "recharts";

const data = [
  { month: 0, weight: 3.2, height: 50, normalWeight: 3.3, normalHeight: 50.5 },
  { month: 1, weight: 4.5, height: 54, normalWeight: 4.5, normalHeight: 54.7 },
  { month: 2, weight: 5.6, height: 58, normalWeight: 5.6, normalHeight: 58.4 },
  { month: 3, weight: 6.4, height: 61, normalWeight: 6.4, normalHeight: 61.4 },
  { month: 4, weight: 7.0, height: 63, normalWeight: 7.0, normalHeight: 63.9 },
  { month: 5, weight: 7.5, height: 65, normalWeight: 7.5, normalHeight: 65.9 },
  { month: 6, weight: 7.8, height: 66.5, normalWeight: 7.9, normalHeight: 67.6 },
];

export default function GrowthChart() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} Bln`} />
          <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", boxShadow: "var(--shadow-md)" }}
            itemStyle={{ color: "var(--foreground)" }}
            labelStyle={{ color: "var(--muted-foreground)", fontWeight: 600, marginBottom: "4px" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          
          {/* WHO standard lines */}
          <Line type="monotone" name="Berat Standar (kg)" dataKey="normalWeight" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
          <Line type="monotone" name="Tinggi Standar (cm)" dataKey="normalHeight" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
          
          {/* Child's actual data lines */}
          <Line type="monotone" name="Berat Anak (kg)" dataKey="weight" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "var(--card)" }} activeDot={{ r: 6 }} />
          <Line type="monotone" name="Tinggi Anak (cm)" dataKey="height" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "var(--card)" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
