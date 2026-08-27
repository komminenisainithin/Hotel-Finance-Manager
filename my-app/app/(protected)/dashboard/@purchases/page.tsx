"use client";

import { PurchasesActivityPanel } from "@/app/components/dashboard/ActivityPanels";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";

export default function DashboardPurchasesSlot() {
  const { data, loading } = useDashboard();

  return (
    <PurchasesActivityPanel
      purchases={data?.recent.purchases ?? []}
      loading={loading && !data}
    />
  );
}
