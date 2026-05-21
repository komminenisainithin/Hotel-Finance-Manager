"use client";

import { useState } from "react";
import { XIcon } from "lucide-react";

import {
  createPurchase,
  updatePurchase,
  type PurchaseRecord,
} from "@/app/lib/apis/purchases";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  purchase?: PurchaseRecord;
};

export default function CreatePurchaseModal({
  onClose,
  onSuccess,
  purchase,
}: Props) {
  const isEdit = !!purchase;

  const [amount, setAmount] = useState(
    isEdit ? String(purchase.amount) : "",
  );
  const [description, setDescription] = useState(
    isEdit ? purchase.description : "",
  );
  const [date, setDate] = useState(
    isEdit
      ? new Date(purchase.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        amount: Number(amount),
        description: description.trim(),
        date: new Date(date).toISOString(),
      };
      const res = isEdit
        ? await updatePurchase(purchase._id, payload)
        : await createPurchase(payload);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(
          res.message ??
            (isEdit ? "Failed to update purchase" : "Failed to create purchase"),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit purchase" : "Create purchase"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]"
              placeholder="e.g. 20000"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]"
              placeholder="e.g. Supplies"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#185FA5] px-4 py-2 text-sm font-medium text-white hover:bg-[#0C447C] disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
