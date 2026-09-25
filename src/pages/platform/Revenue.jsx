import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { cardClass, formatPrice } from "../../utils/ui";

const TYPE_LABELS = {
  checkout: "Checkout",
  renewal: "Renewal",
  upgrade: "Upgrade",
  downgrade: "Downgrade",
  cancel: "Cancellation",
  refund: "Refund",
};

const Revenue = () => {
  const revenueQuery = useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: () => apiClient.get("/admin/revenue").then((r) => r.data),
  });

  if (revenueQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading revenue...</div>;
  if (revenueQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load revenue data.</div>;

  const data = revenueQuery.data;
  const maxMonthly = Math.max(...(data.monthly || []).map((m) => m.revenue), 1);
  const maxPlanRevenue = Math.max(...(data.byPlan || []).map((p) => p.revenue), 1);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Revenue overview</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Gross revenue</div>
          <div className="text-xl font-bold text-white mt-1">
            {formatPrice(data.grossCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Refunds</div>
          <div className="text-xl font-bold text-rose-400 mt-1">
            −{formatPrice(data.refundsCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Net revenue</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {formatPrice(data.netCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs font-medium text-slate-400">Organizations</div>
          <div className="text-xl font-bold text-indigo-300 mt-1">
            {data.activeOrganizations}/{data.totalOrganizations} <span className="text-xs font-normal text-slate-400">active</span>
          </div>
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="text-base font-semibold text-white mb-4">Revenue by month (last 6)</h2>
        <div className="space-y-3">
          {data.monthly?.length === 0 && (
            <p className="text-sm text-slate-400">No revenue recorded yet.</p>
          )}
          {data.monthly?.map((m) => (
            <div key={m._id} className="flex items-center gap-3 text-sm">
              <span className="w-16 text-slate-300 font-medium">{m._id}</span>
              <div className="flex-1 h-5 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((m.revenue / maxMonthly) * 100)}%` }}
                />
              </div>
              <span className="w-24 text-right font-semibold text-white">
                {formatPrice(m.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="text-base font-semibold text-white mb-4">Revenue by plan</h2>
        {data.byPlan?.length === 0 ? (
          <p className="text-sm text-slate-400">No plan revenue recorded yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {data.byPlan?.map((p) => (
              <li key={p.planId} className="py-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white">{p.planName}</span>
                  <span className="text-slate-200 font-medium">
                    {formatPrice(p.revenue)} · <span className="text-slate-400">{p.count} charge(s)</span>
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((p.revenue / maxPlanRevenue) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Recent transactions</h2>
        {data.recent?.length === 0 ? (
          <p className="text-sm text-slate-400">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {data.recent?.map((tx) => (
              <li key={tx.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="text-slate-400 text-xs">{new Date(tx.date).toLocaleDateString()}</span>
                <span className="w-36 font-medium text-white truncate">{tx.orgName}</span>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
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

export default Revenue;