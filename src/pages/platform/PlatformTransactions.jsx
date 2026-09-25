import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { btnSecondary, cardClass, inputClass, formatPrice } from "../../utils/ui";

const TYPE_LABELS = {
  checkout: { label: "Checkout", cls: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  renewal: { label: "Renewal", cls: "bg-sky-500/20 text-sky-300 border border-sky-500/30" },
  upgrade: { label: "Upgrade", cls: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" },
  downgrade: { label: "Downgrade", cls: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
  cancel: { label: "Cancellation", cls: "bg-slate-500/20 text-slate-300 border border-slate-500/30" },
  refund: { label: "Refund", cls: "bg-rose-500/20 text-rose-300 border border-rose-500/30" },
};

const STATUS_LABELS = {
  PENDING: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  SUCCESS: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  FAILED: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
  REFUNDED: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  ROLLED_BACK: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
};

const PlatformTransactions = () => {
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    search: "",
    from: "",
    to: "",
  });
  const [page, setPage] = useState(1);

  const setFilter = (field) => (event) =>
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));

  const transactionsQuery = useQuery({
    queryKey: ["admin", "transactions", filters, page],
    queryFn: () =>
      apiClient
        .get("/admin/transactions", { params: { ...filters, page, limit: 20 } })
        .then((r) => r.data),
  });

  if (transactionsQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading transactions...</div>;
  if (transactionsQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load transactions.</div>;

  const { total, transactions } = transactionsQuery.data;
  const pageCount = Math.max(1, Math.ceil(total / 20));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">All transactions</h2>
      </div>

      <div className={cardClass}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Search</label>
            <input
              className={inputClass}
              placeholder="Organization name or email"
              value={filters.search}
              onChange={setFilter("search")}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Type</label>
            <select className={inputClass} value={filters.type} onChange={setFilter("type")}>
              <option value="">All types</option>
              {Object.entries(TYPE_LABELS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
            <select className={inputClass} value={filters.status} onChange={setFilter("status")}>
              <option value="">All statuses</option>
              {Object.keys(STATUS_LABELS).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">From</label>
            <input
              className={inputClass}
              type="date"
              value={filters.from}
              onChange={setFilter("from")}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">To</label>
            <input
              className={inputClass}
              type="date"
              value={filters.to}
              onChange={setFilter("to")}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4">{total} transaction(s)</p>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400">No transactions match this filter.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {transactions.map((tx) => {
              const t =
                TYPE_LABELS[tx.type] || {
                  label: tx.type,
                  cls: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
                };
              return (
                <li key={tx.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 w-44 shrink-0">
                    <div className="font-semibold text-white truncate">{tx.orgName}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.cls}`}>
                    {t.label}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[tx.status] || "bg-slate-500/20 text-slate-300"}`}
                  >
                    {tx.status}
                  </span>
                  <span className="text-slate-400 text-xs shrink-0">{tx.plan?.slug || "—"}</span>
                  <span
                    className={`ml-auto font-bold ${tx.type === "refund" ? "text-rose-400" : "text-white"}`}
                  >
                    {tx.type === "refund" ? "−" : ""}
                    {formatPrice(tx.amountCents, tx.currency)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {pageCount > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              className={btnSecondary}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              className={btnSecondary}
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformTransactions;