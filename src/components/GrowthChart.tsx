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
import { formatAgeShort } from "@/utils/whoStandards";

interface GrowthChartProps {
  data: any[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">Belum ada data pertumbuhan. Silakan tambah data.</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatAgeShort(val)} />
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
