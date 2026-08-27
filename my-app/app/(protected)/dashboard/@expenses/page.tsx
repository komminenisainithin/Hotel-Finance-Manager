"use client";

import { ExpensesActivityPanel } from "@/app/components/dashboard/ActivityPanels";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";

export default function DashboardExpensesSlot() {
  const { data, loading } = useDashboard();

  return (
    <ExpensesActivityPanel
      expenses={data?.recent.expenses ?? []}
      loading={loading && !data}
    />
  );
}
