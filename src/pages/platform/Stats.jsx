import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import StatusBadge from "../../components/StatusBadge";
import { cardClass, formatPrice, statusStyle } from "../../utils/ui";

const TYPE_LABELS = {
  checkout: "Checkout",
  renewal: "Renewal",
  upgrade: "Upgrade",
  downgrade: "Downgrade",
  cancel: "Cancellation",
  refund: "Refund",
};

const STATUS_ORDER = ["ACTIVE", "PENDING", "TRIAL", "SUSPENDED", "CANCELLED"];

const Stats = () => {
  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiClient.get("/admin/stats").then((r) => r.data),
  });

  if (statsQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading stats...</div>;
  if (statsQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load stats.</div>;

  const s = statsQuery.data;
  const orgs = s.organizations || {};

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Stats & overview</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Organizations</div>
          <div className="text-xl font-bold text-white mt-1">{orgs.total || 0}</div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Paid plans</div>
          <div className="text-xl font-bold text-white mt-1">{s.planCount || 0}</div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Members</div>
          <div className="text-xl font-bold text-white mt-1">{s.memberCount || 0}</div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Transactions</div>
          <div className="text-xl font-bold text-white mt-1">{s.transactionCount || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Gross revenue</div>
          <div className="text-xl font-bold text-white mt-1">
            {formatPrice(s.grossCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Refunds</div>
          <div className="text-xl font-bold text-rose-400 mt-1">
            −{formatPrice(s.refundsCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Net revenue</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {formatPrice(s.netCents || 0)}
          </div>
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="text-base font-semibold text-white mb-4">Organizations by status</h2>
        <ul className="divide-y divide-white/10 text-sm">
          {STATUS_ORDER.map((status) => (
            <li key={status} className="flex items-center justify-between py-2.5">
              <StatusBadge status={status} />
              <span className="font-semibold text-white">
                {orgs[status] || 0} organization(s)
              </span>
            </li>
          ))}
          {Object.keys(statusStyle)
            .filter((st) => orgs[st] && !STATUS_ORDER.includes(st))
            .map((status) => (
              <li key={status} className="flex items-center justify-between py-2.5">
                <StatusBadge status={status} />
                <span className="font-semibold text-white">{orgs[status]} organization(s)</span>
              </li>
            ))}
        </ul>
      </div>

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Recent transactions</h2>
        {s.recentTransactions?.length === 0 ? (
          <p className="text-sm text-slate-400">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {s.recentTransactions?.map((tx) => (
              <li key={tx.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="text-slate-400 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</span>
                <span className="w-44 text-white font-medium truncate">{tx.orgName}</span>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                  {TYPE_LABELS[tx.type] || tx.type}
                </span>
                <span className="ml-auto font-bold text-white">
                  {formatPrice(tx.amountCents, tx.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Stats;