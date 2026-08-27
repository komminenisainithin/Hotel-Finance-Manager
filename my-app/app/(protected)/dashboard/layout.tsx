"use client";

import { DashboardProvider } from "@/app/components/dashboard/DashboardContext";

export default function DashboardLayout({
  children,
  sales,
  purchases,
  expenses,
}: {
  children: React.ReactNode;
  sales: React.ReactNode;
  purchases: React.ReactNode;
  expenses: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-full bg-gray-50">
        {children}
        <div className="grid grid-cols-1 gap-4 px-4 pb-6 lg:grid-cols-3 lg:gap-5 lg:px-6">
          {sales}
          {purchases}
          {expenses}
        </div>
      </div>
    </DashboardProvider>
  );
}
