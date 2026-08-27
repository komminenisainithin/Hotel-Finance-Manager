"use client";

import { SalesActivityPanel } from "@/app/components/dashboard/ActivityPanels";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";

export default function DashboardSalesSlot() {
  const { data, loading } = useDashboard();

  return (
    <SalesActivityPanel
      sales={data?.recent.sales ?? []}
      loading={loading && !data}
    />
  );
}
