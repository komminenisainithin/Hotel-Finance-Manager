"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BadgeDollarSign,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import {
  formatInr,
  type DashboardRecent,
} from "@/app/lib/apis/dashboard";

type Props = {
  recent: DashboardRecent;
};

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type PanelProps = {
  title: string;
  href: string;
  icon: LucideIcon;
  accentBg: string;
  accentText: string;
  empty: string;
  children: React.ReactNode;
  isEmpty: boolean;
};

function Panel({
  title,
  href,
  icon: Icon,
  accentBg,
  accentText,
  empty,
  children,
  isEmpty,
}: PanelProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`rounded-full p-2 ${accentBg}`}>
            <Icon className={`h-4 w-4 ${accentText}`} />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#185FA5] hover:text-[#0C447C]"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isEmpty ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-gray-100">{children}</ul>
      )}
    </div>
  );
}

function Row({
  date,
  primary,
  secondary,
  amountLabel,
  amountClass,
}: {
  date: string;
  primary: string;
  secondary?: string;
  amountLabel: string;
  amountClass: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-gray-50">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{primary}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          <span className="font-medium text-[#185FA5]">{fmtDate(date)}</span>
          {secondary && <span className="ml-1.5">· {secondary}</span>}
        </p>
      </div>
      <span
        className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${amountClass}`}
      >
        {amountLabel}
      </span>
    </li>
  );
}

export default function RecentActivity({ recent }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Panel
        title="Recent sales"
        href="/sales"
        icon={TrendingUp}
        accentBg="bg-teal-50"
        accentText="text-teal-600"
        empty="No sales in this range."
        isEmpty={recent.sales.length === 0}
      >
        {recent.sales.map((sale) => (
          <Row
            key={sale._id}
            date={sale.date}
            primary={`Sale #${sale.salesId}`}
            secondary={`Morning ${formatInr(sale.morning)} · Evening ${formatInr(sale.evening)}`}
            amountLabel={formatInr(sale.total)}
            amountClass="bg-teal-50 text-teal-700"
          />
        ))}
      </Panel>

      <Panel
        title="Recent purchases"
        href="/purchases"
        icon={ShoppingCart}
        accentBg="bg-green-50"
        accentText="text-green-600"
        empty="No purchases in this range."
        isEmpty={recent.purchases.length === 0}
      >
        {recent.purchases.map((purchase) => (
          <Row
            key={purchase._id}
            date={purchase.date}
            primary={purchase.description || "Purchase"}
            amountLabel={formatInr(purchase.amount)}
            amountClass="bg-green-50 text-green-700"
          />
        ))}
      </Panel>

      <Panel
        title="Recent expenses"
        href="/expenses"
        icon={BadgeDollarSign}
        accentBg="bg-red-50"
        accentText="text-red-600"
        empty="No expenses in this range."
        isEmpty={recent.expenses.length === 0}
      >
        {recent.expenses.map((expense) => (
          <Row
            key={expense._id}
            date={expense.date}
            primary={expense.purpose || "Expense"}
            amountLabel={formatInr(expense.amount)}
            amountClass="bg-red-50 text-red-700"
          />
        ))}
      </Panel>
    </div>
  );
}
