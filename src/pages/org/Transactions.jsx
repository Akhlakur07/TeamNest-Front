import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import LogoutButton from "../../components/LogoutButton";
import {
  btnSecondary,
  cardClass,
  formatPrice,
  inputClass,
} from "../../utils/ui";

const TYPE_LABELS = {
  checkout: { label: "Checkout", cls: "bg-emerald-100 text-emerald-700" },
  renewal: { label: "Renewal", cls: "bg-sky-100 text-sky-700" },
  upgrade: { label: "Upgrade", cls: "bg-indigo-100 text-indigo-700" },
  downgrade: { label: "Downgrade", cls: "bg-amber-100 text-amber-700" },
  cancel: { label: "Cancellation", cls: "bg-slate-200 text-slate-600" },
  refund: { label: "Refund", cls: "bg-red-100 text-red-700" },
};

const STATUS_LABELS = {
  PENDING: "bg-amber-100 text-amber-700",
  SUCCESS: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-200 text-slate-600",
  ROLLED_BACK: "bg-slate-200 text-slate-600",
};

const TypeBadge = ({ type }) => {
  const t = TYPE_LABELS[type] || { label: type, cls: "bg-slate-100 text-slate-600" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.cls}`}>{t.label}</span>;
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

  if (transactionsQuery.isLoading) return <div className="p-8">Loading transactions...</div>;
  if (transactionsQuery.isError)
    return <div className="p-8 text-red-600">Failed to load transactions.</div>;

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
        <h1 className="text-2xl font-semibold text-slate-900">Transactions</h1>
        <div className="flex items-center gap-3">
          <button type="button" className={btnSecondary} onClick={handleExport}>
            Export CSV
          </button>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Collected</div>
          <div className="text-lg font-semibold text-slate-900">
            {formatPrice(summary?.collected || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Refunds</div>
          <div className="text-lg font-semibold text-red-600">
            −{formatPrice(summary?.refunded || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Net</div>
          <div className="text-lg font-semibold text-emerald-700">
            {formatPrice(summary?.net || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Transactions</div>
          <div className="text-lg font-semibold text-slate-900">{summary?.count || 0}</div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
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
            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
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
            <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
            <input
              className={inputClass}
              type="date"
              value={filters.from}
              onChange={setFilter("from")}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
            <input
              className={inputClass}
              type="date"
              value={filters.to}
              onChange={setFilter("to")}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-3">{total} transaction(s)</p>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions match this filter.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="text-slate-500 w-20 shrink-0">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </span>
                <TypeBadge type={tx.type} />
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_LABELS[tx.status] || "bg-slate-100"}`}>
                  {tx.status}
                </span>
                <span className="text-slate-500 shrink-0">{tx.plan?.slug || "—"}</span>
                <span
                  className={`ml-auto font-medium ${tx.type === "refund" ? "text-red-600" : "text-slate-900"}`}
                >
                  {tx.type === "refund" ? "−" : ""}
                  {formatPrice(tx.amountCents, tx.currency)}
                </span>
                <a
                  href={tx.metadata?.invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Invoice
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;