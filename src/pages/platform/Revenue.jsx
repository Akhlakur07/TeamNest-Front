import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import LogoutButton from "../../components/LogoutButton";
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

  if (revenueQuery.isLoading) return <div className="p-8">Loading revenue...</div>;
  if (revenueQuery.isError)
    return <div className="p-8 text-red-600">Failed to load revenue data.</div>;

  const data = revenueQuery.data;
  const maxMonthly = Math.max(...(data.monthly || []).map((m) => m.revenue), 1);
  const maxPlanRevenue = Math.max(...(data.byPlan || []).map((p) => p.revenue), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Revenue overview</h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Gross revenue</div>
          <div className="text-lg font-semibold text-slate-900">
            {formatPrice(data.grossCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Refunds</div>
          <div className="text-lg font-semibold text-red-600">
            −{formatPrice(data.refundsCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Net revenue</div>
          <div className="text-lg font-semibold text-emerald-700">
            {formatPrice(data.netCents || 0)}
          </div>
        </div>
        <div className={cardClass}>
          <div className="text-xs text-slate-500">Organizations</div>
          <div className="text-lg font-semibold text-slate-900">
            {data.activeOrganizations}/{data.totalOrganizations} active
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Revenue by month (last 6)</h2>
        <div className="space-y-2">
          {data.monthly?.length === 0 && (
            <p className="text-sm text-slate-500">No revenue recorded yet.</p>
          )}
          {data.monthly?.map((m) => (
            <div key={m._id} className="flex items-center gap-3 text-sm">
              <span className="w-14 text-slate-500">{m._id}</span>
              <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded"
                  style={{ width: `${Math.round((m.revenue / maxMonthly) * 100)}%` }}
                />
              </div>
              <span className="w-20 text-right font-medium text-slate-900">
                {formatPrice(m.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Revenue by plan</h2>
        {data.byPlan?.length === 0 ? (
          <p className="text-sm text-slate-500">No plan revenue recorded yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {data.byPlan?.map((p) => (
              <li key={p.planId}>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-slate-900">{p.planName}</span>
                  <span className="text-slate-900 font-medium">
                    {formatPrice(p.revenue)} · {p.count} charge(s)
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded"
                    style={{ width: `${Math.round((p.revenue / maxPlanRevenue) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Recent transactions</h2>
        {data.recent?.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {data.recent?.map((tx) => (
              <li key={tx.id} className="flex flex-wrap items-center gap-3 py-2">
                <span className="text-slate-500">{new Date(tx.date).toLocaleDateString()}</span>
                <span className="w-28 text-slate-500">{tx.orgName}</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {TYPE_LABELS[tx.type] || tx.type}
                </span>
                <span className="ml-auto font-medium text-slate-900">
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