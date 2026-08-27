"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BadgeDollarSign,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { formatInr } from "@/app/lib/apis/dashboard";
import type { ExpenseRecord } from "@/app/lib/apis/expenses";
import type { PurchaseRecord } from "@/app/lib/apis/purchases";
import type { SalesRecord } from "@/app/lib/apis/sales";

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

type Tone = {
  accentBg: string;
  accentText: string;
  amountClass: string;
};

export const SALES_TONE: Tone = {
  accentBg: "bg-teal-50",
  accentText: "text-teal-700",
  amountClass: "bg-teal-50 text-teal-800",
};

export const PURCHASES_TONE: Tone = {
  accentBg: "bg-emerald-50",
  accentText: "text-emerald-700",
  amountClass: "bg-emerald-50 text-emerald-800",
};

export const EXPENSES_TONE: Tone = {
  accentBg: "bg-rose-50",
  accentText: "text-rose-700",
  amountClass: "bg-rose-50 text-rose-800",
};

function ActivityPanel({
  title,
  href,
  icon: Icon,
  tone,
  empty,
  isEmpty,
  loading,
  children,
}: {
  title: string;
  href: string;
  icon: LucideIcon;
  tone: Tone;
  empty: string;
  isEmpty: boolean;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone.accentBg}`}
          >
            <Icon className={`h-4 w-4 ${tone.accentText}`} />
          </div>
          <h3 className="text-sm font-semibold text-[#132745]">{title}</h3>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#6B7C93] transition hover:text-[#E96B2E]"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 px-5 py-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-[#1F3A5F]/5"
            />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
          <div
            className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${tone.accentBg}`}
          >
            <Icon className={`h-4 w-4 ${tone.accentText}`} />
          </div>
          <p className="text-sm font-medium text-[#132745]">{empty}</p>
          <p className="mt-1 text-xs text-[#6B7C93]">
            New entries will show up here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[#1F3A5F]/6">{children}</ul>
      )}
    </section>
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
    <li className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-[#FAFBFC]">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#132745]">
          {primary}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#6B7C93]">
          <span className="font-medium text-[#1F3A5F]">{fmtDate(date)}</span>
          {secondary && <span className="ml-1.5">· {secondary}</span>}
        </p>
      </div>
      <span
        className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${amountClass}`}
      >
        {amountLabel}
      </span>
    </li>
  );
}

export function SalesActivityPanel({
  sales,
  loading,
}: {
  sales: SalesRecord[];
  loading?: boolean;
}) {
  return (
    <ActivityPanel
      title="Recent sales"
      href="/sales"
      icon={TrendingUp}
      tone={SALES_TONE}
      empty="No sales in this range"
      isEmpty={sales.length === 0}
      loading={loading}
    >
      {sales.map((sale) => (
        <Row
          key={sale._id}
          date={sale.date}
          primary={`Sale #${sale.salesId}`}
          secondary={`Morning ${formatInr(sale.morning)} · Evening ${formatInr(sale.evening)}`}
          amountLabel={formatInr(sale.total)}
          amountClass={SALES_TONE.amountClass}
        />
      ))}
    </ActivityPanel>
  );
}

export function PurchasesActivityPanel({
  purchases,
  loading,
}: {
  purchases: PurchaseRecord[];
  loading?: boolean;
}) {
  return (
    <ActivityPanel
      title="Recent purchases"
      href="/purchases"
      icon={ShoppingCart}
      tone={PURCHASES_TONE}
      empty="No purchases in this range"
      isEmpty={purchases.length === 0}
      loading={loading}
    >
      {purchases.map((purchase) => (
        <Row
          key={purchase._id}
          date={purchase.date}
          primary={purchase.description || "Purchase"}
          amountLabel={formatInr(purchase.amount)}
          amountClass={PURCHASES_TONE.amountClass}
        />
      ))}
    </ActivityPanel>
  );
}

export function ExpensesActivityPanel({
  expenses,
  loading,
}: {
  expenses: ExpenseRecord[];
  loading?: boolean;
}) {
  return (
    <ActivityPanel
      title="Recent expenses"
      href="/expenses"
      icon={BadgeDollarSign}
      tone={EXPENSES_TONE}
      empty="No expenses in this range"
      isEmpty={expenses.length === 0}
      loading={loading}
    >
      {expenses.map((expense) => (
        <Row
          key={expense._id}
          date={expense.date}
          primary={expense.purpose || "Expense"}
          amountLabel={formatInr(expense.amount)}
          amountClass={EXPENSES_TONE.amountClass}
        />
      ))}
    </ActivityPanel>
  );
}
