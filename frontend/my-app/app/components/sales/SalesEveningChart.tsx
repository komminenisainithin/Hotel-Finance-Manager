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

import {
  EVENING_COLOR,
  formatInr,
  toSalesChartData,
  type SalesRecord,
} from "@/app/lib/apis/sales";

import ChartCard, { LegendItem } from "./ChartCard";

const CHART_HEIGHT = 220;

export default function SalesEveningChart({
  data = [],
}: {
  data?: SalesRecord[];
}) {
  const chartData = toSalesChartData(data);

  if (chartData.length === 0) {
    return (
      <ChartCard title="Evening sales trend" subtitle="Line chart over time">
        <p className="py-16 text-center text-sm text-gray-500">
          No sales data yet.
        </p>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Evening sales trend"
      subtitle="Line chart over time"
      legend={<LegendItem color={EVENING_COLOR} label="Evening" />}
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
            />
            <Tooltip formatter={(value) => formatInr(Number(value))} />
            <Area
              type="monotone"
              dataKey="evening"
              name="Evening"
              stroke={EVENING_COLOR}
              fill={EVENING_COLOR}
              fillOpacity={0.08}
              strokeWidth={2}
              dot={{ r: 4, fill: EVENING_COLOR }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
