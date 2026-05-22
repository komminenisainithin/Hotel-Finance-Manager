"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard, { LegendItem } from "@/app/components/sales/ChartCard";
import { formatInr, type DashboardTotals } from "@/app/lib/apis/dashboard";

const SALES_COLOR = "#0F766E";
const PURCHASES_COLOR = "#16A34A";
const EXPENSES_COLOR = "#DC2626";

type Props = {
  totals: DashboardTotals;
};

export default function OverviewChart({ totals }: Props) {
  const data = [
    { label: "Sales", value: totals.sales, color: SALES_COLOR },
    { label: "Purchases", value: totals.purchases, color: PURCHASES_COLOR },
    { label: "Expenses", value: totals.expenses, color: EXPENSES_COLOR },
  ];

  const hasData = data.some((item) => item.value > 0);
  const profitPositive = totals.profit >= 0;
  const subtitle = profitPositive
    ? `Net profit ${formatInr(totals.profit)}`
    : `Net loss ${formatInr(Math.abs(totals.profit))}`;

  return (
    <ChartCard
      title="Cashflow overview"
      subtitle={subtitle}
      className="w-full"
      legend={
        <>
          <LegendItem color={SALES_COLOR} label="Sales" />
          <LegendItem color={PURCHASES_COLOR} label="Purchases" />
          <LegendItem color={EXPENSES_COLOR} label="Expenses" />
        </>
      }
    >
      {!hasData ? (
        <p className="py-16 text-center text-sm text-gray-500">
          No activity in this range yet.
        </p>
      ) : (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(128,128,128,0.15)"
              />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) =>
                  `₹${Number(v).toLocaleString("en-IN")}`
                }
                width={70}
              />
              <Tooltip
                formatter={(value) => formatInr(Number(value))}
                labelStyle={{ fontSize: 12 }}
                cursor={{ fill: "rgba(24,95,165,0.06)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
