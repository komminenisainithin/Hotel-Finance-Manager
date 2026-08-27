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
  accent: string;
  soft: string;
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
      accent: "text-teal-700",
      soft: "bg-teal-50",
    },
    {
      label: "Purchases",
      value: totals.purchases,
      countLabel: `${counts.purchases} record${counts.purchases === 1 ? "" : "s"}`,
      icon: ShoppingCart,
      accent: "text-emerald-700",
      soft: "bg-emerald-50",
    },
    {
      label: "Expenses",
      value: totals.expenses,
      countLabel: `${counts.expenses} record${counts.expenses === 1 ? "" : "s"}`,
      icon: BadgeDollarSign,
      accent: "text-rose-700",
      soft: "bg-rose-50",
    },
    {
      label: "Profit",
      value: totals.profit,
      countLabel: profitPositive ? "In the green" : "Operating loss",
      icon: profitPositive ? TrendingUp : TrendingDown,
      accent: profitPositive ? "text-[#E96B2E]" : "text-rose-700",
      soft: profitPositive ? "bg-orange-50" : "bg-rose-50",
      valueClass: profitPositive ? "text-[#E96B2E]" : "text-rose-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#6B7C93]">{card.label}</p>
              <p
                className={`mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl ${
                  card.valueClass ?? "text-[#132745]"
                }`}
              >
                {formatInr(card.value)}
              </p>
              <p className="mt-1 text-xs text-[#6B7C93]">{card.countLabel}</p>
            </div>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.soft}`}
            >
              <Icon className={`h-4 w-4 ${card.accent}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
