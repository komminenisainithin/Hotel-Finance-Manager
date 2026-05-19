"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import CreateSaleModal from "@/app/components/sales/CreateSaleModal";
import SalesCombinedChart from "@/app/components/sales/SalesCombinedChart";
import SalesEveningChart from "@/app/components/sales/SalesEveningChart";
import SalesMetrics from "@/app/components/sales/SalesMetrics";
import SalesMorningChart from "@/app/components/sales/SalesMorningChart";
import SalesTable from "@/app/components/sales/SalesTable";
import { useAuth } from "@/app/context/AuthContext";
import { deleteSale, getSales, type SalesRecord } from "@/app/lib/apis/sales";


export default function SalesPage() {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editSale, setEditSale] = useState<SalesRecord | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    getSales()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message ?? "Failed to load sales");
        }
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load sales"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (authLoading || !token) return;
    fetchSales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-medium text-gray-900">Sales dashboard</h1>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#185FA5] px-4 py-2 text-sm font-medium text-white hover:bg-[#0C447C]"
        >
          <PlusIcon className="h-4 w-4" />
          Create sale
        </button>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {loading && <p className="text-gray-500">Loading sales…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {deleteError && <p className="text-red-600">{deleteError}</p>}
        {!loading && !error && (
          <>
            <SalesMetrics data={data} />
            <SalesCombinedChart data={data} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SalesMorningChart data={data} />
              <SalesEveningChart data={data} />
            </div>
            <SalesTable
                data={data}
                onEdit={(sale) => setEditSale(sale)}
                onDelete={handleDelete}
              />
          </>
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
