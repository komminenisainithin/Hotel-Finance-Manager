"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import { PurchasesPageSkeleton } from "@/app/components/PageSkeletons";
import CreatePurchaseModal from "@/app/components/purchases/CreatePurchaseModal";
import PurchasesTable from "@/app/components/purchases/PurchasesTable";
import { useAuth } from "@/app/context/AuthContext";
import {
  deletePurchase,
  formatInr,
  getPurchases,
  type PurchaseRecord,
} from "@/app/lib/apis/purchases";

export default function PurchasesPage() {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editPurchase, setEditPurchase] = useState<PurchaseRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(purchase: PurchaseRecord) {
    const dateLabel = new Date(purchase.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    if (
      !confirm(
        `Delete this purchase (${formatInr(purchase.amount)} on ${dateLabel})? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleteError(null);
    try {
      await deletePurchase(purchase._id);
      fetchPurchases(true);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete purchase",
      );
    }
  }

  function fetchPurchases(silent = false) {
    if (!silent) setLoading(true);
    setError(null);
    getPurchases()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message ?? "Failed to load purchases");
        }
      })
      .catch((err: unknown) =>
        setError(
          err instanceof Error ? err.message : "Failed to load purchases",
        ),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (authLoading || !token) return;
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading]);

  return (
    <div className="w-full min-h-full bg-gray-50/50">
      <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <h1 className="text-lg font-semibold text-[#132745]">
            Purchases dashboard
          </h1>
          <p className="text-sm text-[#6B7C93]">
            Manage and track purchase records
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F3A5F] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#132745]"
        >
          <PlusIcon className="h-4 w-4" />
          Create purchase
        </button>
      </div>

      <div className="flex flex-col gap-5 p-4 lg:p-6">
        {error && <p className="text-red-600">{error}</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
        {loading ? (
          <PurchasesPageSkeleton />
        ) : (
          !error && (
            <PurchasesTable
              data={data}
              onEdit={(purchase) => setEditPurchase(purchase)}
              onDelete={handleDelete}
            />
          )
        )}
      </div>

      {showModal && (
        <CreatePurchaseModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchPurchases(true)}
        />
      )}
      {editPurchase && (
        <CreatePurchaseModal
          purchase={editPurchase}
          onClose={() => setEditPurchase(null)}
          onSuccess={() => fetchPurchases(true)}
        />
      )}
    </div>
  );
}
