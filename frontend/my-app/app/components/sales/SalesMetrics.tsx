"use client";

import {
  computeSalesMetrics,
  formatInr,
  type SalesRecord,
} from "@/app/lib/apis/sales";

export default function SalesMetrics({ data = [] }: { data?: SalesRecord[] }) {
  const metrics = computeSalesMetrics(data);

  const items = [
    { label: "Total morning", value: formatInr(metrics.totalMorning) },
    { label: "Total evening", value: formatInr(metrics.totalEvening) },
    { label: "Grand total", value: formatInr(metrics.grandTotal) },
    { label: "Avg per day", value: formatInr(metrics.avgPerDay) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg bg-gray-50 px-4 py-3.5"
        >
          <p className="mb-1 text-xs text-gray-500">{item.label}</p>
          <p className="text-xl font-medium text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
