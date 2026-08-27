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

import { formatInr, type DashboardTotals } from "@/app/lib/apis/dashboard";

const SALES_COLOR = "#0F766E";
const PURCHASES_COLOR = "#059669";
const EXPENSES_COLOR = "#E11D48";

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
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#132745]">
            Cashflow overview
          </h2>
          <p
            className={`mt-0.5 text-sm font-medium ${
              profitPositive ? "text-[#E96B2E]" : "text-rose-600"
            }`}
          >
            {subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { color: SALES_COLOR, label: "Sales" },
            { color: PURCHASES_COLOR, label: "Purchases" },
            { color: EXPENSES_COLOR, label: "Expenses" },
          ].map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7C93]"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {!hasData ? (
        <p className="px-5 py-16 text-center text-sm text-[#6B7C93]">
          No activity in this range yet.
        </p>
      ) : (
        <div className="h-[280px] w-full px-2 pb-3 pt-4 sm:px-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(31,58,95,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#6B7C93" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6B7C93" }}
                tickFormatter={(v) =>
                  `₹${Number(v).toLocaleString("en-IN")}`
                }
                width={72}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => formatInr(Number(value))}
                labelStyle={{ fontSize: 12, color: "#132745" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(31,58,95,0.12)",
                  boxShadow: "0 8px 24px rgba(19,39,69,0.08)",
                }}
                cursor={{ fill: "rgba(233,107,46,0.06)" }}
              />
              <Bar dataKey="value" radius={[10, 10, 4, 4]} maxBarSize={72}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
