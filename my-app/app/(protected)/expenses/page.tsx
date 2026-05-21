"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import CreateExpenseModal from "@/app/components/expenses/CreateExpenseModal";
import ExpensesTable from "@/app/components/expenses/ExpensesTable";
import { useAuth } from "@/app/context/AuthContext";
import {
  deleteExpense,
  formatInr,
  getExpenses,
  type ExpenseRecord,
} from "@/app/lib/apis/expenses";

export default function ExpensesPage() {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState<ExpenseRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    getExpenses()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
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

  useEffect(() => {
    if (authLoading || !token) return;
    fetchExpenses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-medium text-gray-900">Expenses dashboard</h1>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#185FA5] px-4 py-2 text-sm font-medium text-white hover:bg-[#0C447C]"
        >
          <PlusIcon className="h-4 w-4" />
          Create expense
        </button>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {loading && <p className="text-gray-500">Loading expenses…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
        {!loading && !error && (
          <ExpensesTable
            data={data}
            onEdit={(expense) => setEditExpense(expense)}
            onDelete={handleDelete}
          />
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
