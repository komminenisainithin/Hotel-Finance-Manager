function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-gray-200/80 bg-white ${className}`}
    />
  );
}

export function KpiSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-2xl border border-gray-200/80 bg-white px-4 py-4"
        >
          <div className="h-3 w-16 rounded bg-gray-100" />
          <div className="mt-3 h-7 w-28 rounded bg-gray-100" />
          <div className="mt-2 h-3 w-20 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({
  height = 280,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse overflow-hidden rounded-2xl border border-gray-200/80 bg-white ${className}`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <div className="h-4 w-36 rounded bg-gray-100" />
          <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
        </div>
        <div className="hidden gap-3 sm:flex">
          <div className="h-3 w-14 rounded bg-gray-100" />
          <div className="h-3 w-14 rounded bg-gray-100" />
        </div>
      </div>
      <div className="px-5 py-6" style={{ height }}>
        <div className="flex h-full items-end gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-gray-100"
              style={{ height: `${40 + ((i * 17) % 50)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-3 w-44 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-7 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="divide-y divide-gray-50 px-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4">
            <div className="h-4 w-8 animate-pulse rounded bg-gray-100" />
            <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
            <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-100 sm:block" />
            <div className="hidden h-4 w-20 animate-pulse rounded bg-gray-100 md:block" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityPanelsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="h-3 w-14 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="space-y-3 px-4 py-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3.5 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <KpiSkeleton />
      <ChartSkeleton height={280} />
    </div>
  );
}

export function SalesPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <KpiSkeleton />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartSkeleton height={220} />
        <ChartSkeleton height={220} />
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}

export function ExpensesPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <TableSkeleton rows={7} />
    </div>
  );
}

export function PurchasesPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <TableSkeleton rows={7} />
    </div>
  );
}

export { SkeletonBlock };
