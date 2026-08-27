"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";

import DateRangeFilter, {
  resolvePresetDates,
  type DateRangeValue,
} from "@/app/components/DateRangeFilter";
import CreateSaleModal from "@/app/components/sales/CreateSaleModal";
import SalesEveningChart from "@/app/components/sales/SalesEveningChart";
import SalesMetrics from "@/app/components/sales/SalesMetrics";
import SalesMorningChart from "@/app/components/sales/SalesMorningChart";
import SalesTable from "@/app/components/sales/SalesTable";
import { useAuth } from "@/app/context/AuthContext";
import { deleteSale, getSales, type SalesRecord } from "@/app/lib/apis/sales";

const PER_PAGE = 50;

export default function SalesPage() {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<SalesRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editSale, setEditSale] = useState<SalesRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateRangeValue>({
    preset: "all",
  });

  async function handleDelete(sale: SalesRecord) {
    if (!confirm(`Delete sale #${sale.salesId}? This cannot be undone.`)) return;
    setDeleteError(null);
    try {
      await deleteSale(sale.salesId);
      fetchSales(true);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete sale");
    }
  }

  function fetchSales(silent = false) {
    if (!silent) setLoading(true);
    setError(null);

    const range = resolvePresetDates(
      dateFilter.preset,
      dateFilter.startDate,
      dateFilter.endDate,
    );
    const hasDateFilter = Boolean(range.startDate && range.endDate);

    getSales({
      page,
      per_page: PER_PAGE,
      ...(hasDateFilter
        ? { start_date: range.startDate, end_date: range.endDate }
        : {}),
    })
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data.sales ?? []);
          setTotal(res.data.total_items ?? res.data.total ?? 0);
          setTotalPages(Math.max(1, res.data.total_pages || 1));
        } else {
          setError(res.message ?? "Failed to load sales");
        }
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load sales"),
      )
      .finally(() => setLoading(false));
  }

  function handleDateFilterChange(next: DateRangeValue) {
    setDateFilter(next);
    setPage(1);
  }

  useEffect(() => {
    if (authLoading || !token) return;
    if (
      dateFilter.preset === "custom" &&
      (!dateFilter.startDate || !dateFilter.endDate)
    ) {
      return;
    }
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading, page, dateFilter]);

  const pages = Math.max(1, totalPages);
  const canPrev = page > 1;
  const canNext = page < pages;

  return (
    <div className="w-full min-h-full bg-gray-50/50">
      <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold text-[#132745]">
            Sales dashboard
          </h1>
          <p className="text-sm text-[#6B7C93]">
            Filter and manage daily sales
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F3A5F] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#132745]"
        >
          <PlusIcon className="h-4 w-4" />
          Create sale
        </button>
      </div>

      <div className="px-4 pt-4 lg:px-6">
        <DateRangeFilter
          value={dateFilter}
          onChange={handleDateFilterChange}
          emptyLabel="Showing all sales"
        />
      </div>

      <div className="flex flex-col gap-5 p-4 lg:p-6">
        {loading && <p className="text-gray-500">Loading sales…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
        {!loading && !error && (
          <>
            <SalesMetrics data={data} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SalesMorningChart data={data} />
              <SalesEveningChart data={data} />
            </div>
            <SalesTable
              data={data}
              total={total}
              page={page}
              perPage={PER_PAGE}
              onEdit={(sale) => setEditSale(sale)}
              onDelete={handleDelete}
            />
          </>
        )}

        {!loading && !error && pages > 1 && (
          <nav
            aria-label="Sales pagination"
            className="flex items-center justify-center gap-5 py-2"
          >
            <button
              type="button"
              disabled={!canPrev}
              aria-label="Previous page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
                canPrev
                  ? "text-[#5B8FA0] hover:bg-[#5B8FA0]/10"
                  : "cursor-not-allowed text-[#9AABB4] opacity-50"
              }`}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <div className="flex items-center gap-4">
              {Array.from({ length: pages }, (_, i) => {
                const pageNum = i + 1;
                const active = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    aria-label={`Page ${pageNum}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setPage(pageNum)}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium transition ${
                      active
                        ? "border border-[#5B8FA0] text-[#5B8FA0]"
                        : "text-[#6E7D8A] hover:text-[#5B8FA0]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!canNext}
              aria-label="Next page"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
                canNext
                  ? "text-[#5B8FA0] hover:bg-[#5B8FA0]/10"
                  : "cursor-not-allowed text-[#9AABB4] opacity-50"
              }`}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </nav>
        )}
      </div>

      {showModal && (
        <CreateSaleModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchSales(true)}
        />
      )}
      {editSale && (
        <CreateSaleModal
          sale={editSale}
          onClose={() => setEditSale(null)}
          onSuccess={() => fetchSales(true)}
        />
      )}
    </div>
  );
}
