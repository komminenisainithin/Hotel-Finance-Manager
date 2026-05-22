"use client";

import {
  BadgeDollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import {
  formatInr,
  type DashboardCounts,
  type DashboardTotals,
} from "@/app/lib/apis/dashboard";

type Props = {
  totals: DashboardTotals;
  counts: DashboardCounts;
};

type CardConfig = {
  label: string;
  value: number;
  countLabel: string;
  icon: LucideIcon;
  iconClass: string;
  ringClass: string;
  valueClass?: string;
};

export default function KpiCards({ totals, counts }: Props) {
  const profitPositive = totals.profit >= 0;

  const cards: CardConfig[] = [
    {
      label: "Sales",
      value: totals.sales,
      countLabel: `${counts.sales} record${counts.sales === 1 ? "" : "s"}`,
      icon: TrendingUp,
      iconClass: "text-teal-600",
      ringClass: "bg-teal-50",
    },
    {
      label: "Purchases",
      value: totals.purchases,
      countLabel: `${counts.purchases} record${counts.purchases === 1 ? "" : "s"}`,
      icon: ShoppingCart,
      iconClass: "text-green-600",
      ringClass: "bg-green-50",
    },
    {
      label: "Expenses",
      value: totals.expenses,
      countLabel: `${counts.expenses} record${counts.expenses === 1 ? "" : "s"}`,
      icon: BadgeDollarSign,
      iconClass: "text-red-600",
      ringClass: "bg-red-50",
    },
    {
      label: "Profit",
      value: totals.profit,
      countLabel: profitPositive ? "In the green" : "Operating loss",
      icon: profitPositive ? TrendingUp : TrendingDown,
      iconClass: profitPositive ? "text-[#185FA5]" : "text-red-600",
      ringClass: profitPositive ? "bg-blue-50" : "bg-red-50",
      valueClass: profitPositive ? "text-[#185FA5]" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex items-start justify-between rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:shadow"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {card.label}
              </p>
              <p
                className={`text-2xl font-semibold ${card.valueClass ?? "text-gray-900"}`}
              >
                {formatInr(card.value)}
              </p>
              <p className="text-xs text-gray-500">{card.countLabel}</p>
            </div>
            <div className={`rounded-full p-2.5 ${card.ringClass}`}>
              <Icon className={`h-5 w-5 ${card.iconClass}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
