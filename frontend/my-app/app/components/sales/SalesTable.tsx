"use client";

import { Pencil, Trash2 } from "lucide-react";

import {
  formatInr,
  sortSalesByDate,
  type SalesRecord,
} from "@/app/lib/apis/sales";

export default function SalesTable({ data = [] }: { data?: SalesRecord[] }) {
  const rows = sortSalesByDate(data);

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3.5">
        <span className="text-sm font-medium text-gray-900">Sales records</span>
        <span className="text-xs text-gray-500">{rows.length} records</span>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">
          No sales records yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="w-10 px-3.5 py-2.5">#</th>
                <th className="w-28 px-3.5 py-2.5">Date</th>
                <th className="w-24 px-3.5 py-2.5">Morning</th>
                <th className="w-24 px-3.5 py-2.5">Evening</th>
                <th className="w-24 px-3.5 py-2.5">Total</th>
                <th className="px-3.5 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-3.5 py-2.5 text-gray-500">{row.salesId}</td>
                  <td className="px-3.5 py-2.5">
                    <span className="font-medium text-[#185FA5] underline decoration-[#185FA5]/40">
                      {fmtDate(row.date)}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-[#E6F1FB] text-[#0C447C]">
                      {formatInr(row.morning)}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-[#FAEEDA] text-[#633806]">
                      {formatInr(row.evening)}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 font-medium">
                    {formatInr(row.total)}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
                        onClick={() =>
                          alert(`Edit sale #${row.salesId} — connect to API`)
                        }
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50"
                        onClick={() =>
                          alert(`Delete sale #${row.salesId} — connect to API`)
                        }
                      >
                        <Trash2 className="h-3 w-3" />
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
