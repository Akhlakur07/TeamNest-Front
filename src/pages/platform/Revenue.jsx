import { useQuery } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import {
  MonthlyRevenueAreaChart,
  RevenueByPlanBarChart,
} from "../../components/DashboardCharts";
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-white tracking-tight">Revenue overview</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bento-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Gross revenue
          </div>
          <div className="font-mono text-2xl font-bold text-white mt-1">
            {formatPrice(data.grossCents || 0)}
          </div>
        </div>
        <div className="bento-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Refunds
          </div>
          <div className="font-mono text-2xl font-bold text-rose-400 mt-1">
            −{formatPrice(data.refundsCents || 0)}
          </div>
        </div>
        <div className="bento-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Net revenue
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">
            {formatPrice(data.netCents || 0)}
          </div>
        </div>
        <div className="bento-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Organizations
          </div>
          <div className="font-mono text-2xl font-bold text-indigo-300 mt-1">
            {data.activeOrganizations}/{data.totalOrganizations}{" "}
            <span className="text-xs font-sans font-normal text-slate-400">active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 min-w-0">
          <MonthlyRevenueAreaChart monthly={data.monthly || []} />
        </div>
        <div className="lg:col-span-5 min-w-0">
          <RevenueByPlanBarChart byPlan={data.byPlan || []} />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="font-display text-base font-bold text-white mb-4">Recent transactions</h2>
        {data.recent?.length === 0 ? (
          <p className="text-sm text-slate-400">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {data.recent?.map((tx) => (
              <li key={tx.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="text-slate-400 font-mono text-xs">
                  {new Date(tx.date).toLocaleDateString()}
                </span>
                <span className="w-36 font-medium text-white truncate">{tx.orgName}</span>
                <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
                  {TYPE_LABELS[tx.type] || tx.type}
                </span>
                <span className="ml-auto font-mono font-bold text-white">
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
