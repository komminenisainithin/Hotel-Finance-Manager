"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";

import DateRangeFilter, {
  type DateRangeValue,
} from "@/app/components/DateRangeFilter";
import CreateExpenseModal from "@/app/components/expenses/CreateExpenseModal";
import ExpensesTable from "@/app/components/expenses/ExpensesTable";
import { ExpensesPageSkeleton } from "@/app/components/PageSkeletons";
import { useAuth } from "@/app/context/AuthContext";
import {
  deleteExpense,
  formatInr,
  getExpenses,
  type ExpenseRecord,
  type ExpenseStats,
} from "@/app/lib/apis/expenses";

const PER_PAGE = 50;

const emptyStats: ExpenseStats = {
  total: 0,
  page: 1,
  limit: PER_PAGE,
  totalPages: 1,
};

export default function ExpensesPage() {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<ExpenseRecord[]>([]);
  const [stats, setStats] = useState<ExpenseStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState<ExpenseRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<DateRangeValue>({
    preset: "all",
  });

  async function handleDelete(expense: ExpenseRecord) {
    const dateLabel = new Date(expense.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (
      !confirm(
        `Delete this expense (${formatInr(expense.amount)} on ${dateLabel})? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleteError(null);
    try {
      await deleteExpense(expense._id);
      fetchExpenses(true);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete expense",
      );
    }
  }

  function fetchExpenses(silent = false) {
    if (!silent) setLoading(true);
    setError(null);

    getExpenses({
      page,
      per_page: PER_PAGE,
      filter: dateFilter.preset,
      ...(dateFilter.preset === "custom"
        ? {
            startDate: dateFilter.startDate,
            endDate: dateFilter.endDate,
          }
        : {}),
    })
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data.expenses ?? []);
          setStats(res.data.stats ?? emptyStats);
        } else {
          setError(res.message ?? "Failed to load expenses");
        }
      })
      .catch((err: unknown) =>
        setError(
          err instanceof Error ? err.message : "Failed to load expenses",
        ),
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
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading, page, dateFilter]);

  const totalPages = Math.max(1, stats.totalPages || 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="w-full min-h-full bg-gray-50/50">
      <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold text-[#132745]">
            Expenses dashboard
          </h1>
          <p className="text-sm text-[#6B7C93]">
            Filter and manage expense records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F3A5F] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#132745]"
        >
          <PlusIcon className="h-4 w-4" />
          Create expense
        </button>
      </div>

      <div className="px-4 pt-4 lg:px-6">
        <DateRangeFilter
          value={dateFilter}
          onChange={handleDateFilterChange}
          emptyLabel="Showing all expenses"
        />
      </div>

      <div className="flex flex-col gap-5 p-4 lg:p-6">
        {error && <p className="text-red-600">{error}</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
        {loading ? (
          <ExpensesPageSkeleton />
        ) : (
          !error && (
            <ExpensesTable
              data={data}
              total={stats.total}
              page={stats.page}
              perPage={stats.limit}
              onEdit={(expense) => setEditExpense(expense)}
              onDelete={handleDelete}
            />
          )
        )}

        {!loading && !error && totalPages > 1 && (
          <nav
            aria-label="Expenses pagination"
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
              {Array.from({ length: totalPages }, (_, i) => {
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
        <CreateExpenseModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchExpenses(true)}
        />
      )}
      {editExpense && (
        <CreateExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
          onSuccess={() => fetchExpenses(true)}
        />
      )}
    </div>
  );
}
