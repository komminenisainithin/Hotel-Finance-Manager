"use client";

import { Pencil, Trash2 } from "lucide-react";

import {
  formatInr,
  sortExpensesByDate,
  type ExpenseRecord,
} from "@/app/lib/apis/expenses";

export default function ExpensesTable({
  data = [],
  onEdit,
  onDelete,
}: {
  data?: ExpenseRecord[];
  onEdit?: (expense: ExpenseRecord) => void;
  onDelete?: (expense: ExpenseRecord) => void;
}) {
  const rows = sortExpensesByDate(data);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Expense Records
          </h2>
          <p className="text-sm text-gray-500">Manage and track expenses</p>
        </div>

        <div className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700">
          {rows.length} Records
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <p className="text-sm font-medium text-gray-700">
            No expense records found
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Expense entries will appear here once added.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Purpose
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row._id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-medium text-[#185FA5]">
                      {fmtDate(row.date)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      {formatInr(row.amount)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.purpose}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => onEdit?.(row)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50"
                        onClick={() => onDelete?.(row)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
