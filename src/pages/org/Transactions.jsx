import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import {
  btnSecondary,
  cardClass,
  formatPrice,
  inputClass,
} from "../../utils/ui";

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

const TypeBadge = ({ type }) => {
  const t = TYPE_LABELS[type] || {
    label: type,
    cls: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.cls}`}>{t.label}</span>;
};

const Transactions = () => {
  const [filters, setFilters] = useState({ type: "", status: "", from: "", to: "" });

  const setFilter = (field) => (event) =>
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));

  const transactionsQuery = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () =>
      apiClient.get("/transactions", { params: filters }).then((r) => r.data),
  });

  if (transactionsQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading transactions...</div>;
  if (transactionsQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load transactions.</div>;

  const { summary, total, transactions } = transactionsQuery.data;

  const handleExport = async () => {
    try {
      const { data } = await apiClient.get("/transactions/export", {
        responseType: "blob",
        params: filters,
      });
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore export errors silently in this view
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Transactions</h2>
        <button type="button" className={btnSecondary} onClick={handleExport}>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Collected</div>
          <div className="text-xl font-bold text-white mt-1">
            {formatPrice(summary?.collected || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Refunds</div>
          <div className="text-xl font-bold text-rose-400 mt-1">
            −{formatPrice(summary?.refunded || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Net</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {formatPrice(summary?.net || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Transactions</div>
          <div className="text-xl font-bold text-white mt-1">{summary?.count || 0}</div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
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
            {transactions.map((tx) => (
              <li key={tx.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="text-slate-400 text-xs w-24 shrink-0">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </span>
                <TypeBadge type={tx.type} />
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[tx.status] || "bg-slate-500/20 text-slate-300"}`}>
                  {tx.status}
                </span>
                <span className="text-slate-400 text-xs shrink-0">{tx.plan?.slug || "—"}</span>
                <span
                  className={`ml-auto font-bold ${tx.type === "refund" ? "text-rose-400" : "text-white"}`}
                >
                  {tx.type === "refund" ? "−" : ""}
                  {formatPrice(tx.amountCents, tx.currency)}
                </span>
                {tx.metadata?.invoiceUrl && (
                  <a
                    href={tx.metadata.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Invoice
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;