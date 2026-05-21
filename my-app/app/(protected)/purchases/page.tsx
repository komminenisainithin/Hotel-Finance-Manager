"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

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
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-medium text-gray-900">Purchases dashboard</h1>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#185FA5] px-4 py-2 text-sm font-medium text-white hover:bg-[#0C447C]"
        >
          <PlusIcon className="h-4 w-4" />
          Create purchase
        </button>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {loading && <p className="text-gray-500">Loading purchases…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
        {!loading && !error && (
          <PurchasesTable
            data={data}
            onEdit={(purchase) => setEditPurchase(purchase)}
            onDelete={handleDelete}
          />
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
