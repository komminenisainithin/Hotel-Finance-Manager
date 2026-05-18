"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  EVENING_COLOR,
  formatInr,
  MORNING_COLOR,
  toSalesChartData,
  type SalesRecord,
} from "@/app/lib/apis/sales";

import ChartCard, { LegendItem } from "./ChartCard";

const CHART_HEIGHT = 220;

export default function SalesCombinedChart({
  data = [],
}: {
  data?: SalesRecord[];
}) {
  const chartData = toSalesChartData(data);

  if (chartData.length === 0) {
    return (
      <ChartCard
        title="Morning vs evening — combined"
        subtitle="Grouped by date"
        className="w-full"
      >
        <p className="py-16 text-center text-sm text-gray-500">
          No sales data yet.
        </p>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Morning vs evening — combined"
      subtitle="Grouped by date"
      className="w-full"
      legend={
        <>
          <LegendItem color={MORNING_COLOR} label="Morning" />
          <LegendItem color={EVENING_COLOR} label="Evening" />
        </>
      }
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={chartData.length > 4 ? -25 : 0}
              textAnchor={chartData.length > 4 ? "end" : "middle"}
              height={chartData.length > 4 ? 50 : 30}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
            />
            <Tooltip
              formatter={(value) => formatInr(Number(value))}
              labelStyle={{ fontSize: 12 }}
            />
            <Bar
              dataKey="morning"
              name="Morning"
              fill={MORNING_COLOR}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="evening"
              name="Evening"
              fill={EVENING_COLOR}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
