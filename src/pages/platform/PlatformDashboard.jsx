import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  DollarSign,
  Layers,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import UserCard from "../../components/UserCard";
import {
  MonthlyRevenueAreaChart,
  OrgStatusDonutChart,
} from "../../components/DashboardCharts";
import apiClient from "../../utils/apiClient";
import { cardClass, formatPrice } from "../../utils/ui";

const quickLinks = [
  {
    to: "/admin/organizations",
    title: "Organizations",
    desc: "Search tenants, inspect billing status, or suspend & reactivate workspaces.",
    icon: Building2,
  },
  {
    to: "/admin/plans",
    title: "Plans & Pricing",
    desc: "Create subscription tiers, sync Stripe prices, and toggle plan availability.",
    icon: Layers,
  },
  {
    to: "/admin/revenue",
    title: "Revenue Analytics",
    desc: "Monitor gross vs. net revenue, monthly trends, and per-plan breakdown.",
    icon: TrendingUp,
  },
  {
    to: "/admin/transactions",
    title: "Global Transactions",
    desc: "Audit every checkout, renewal, upgrade, and refund across all tenants.",
    icon: Receipt,
  },
];

const PlatformDashboard = () => {
  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiClient.get("/admin/stats").then((r) => r.data),
  });

  const revenueQuery = useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: () => apiClient.get("/admin/revenue").then((r) => r.data),
  });

  const s = statsQuery.data;
  const rev = revenueQuery.data;
  const kpis = [
    {
      label: "Total Organizations",
      value: s ? s.organizations?.total || 0 : "—",
      sub: s ? `${s.organizations?.ACTIVE || 0} active` : "Loading…",
      icon: Building2,
    },
    {
      label: "Net Revenue",
      value: s ? formatPrice(s.netCents || 0) : "—",
      sub: s ? `Gross ${formatPrice(s.grossCents || 0)}` : "Loading…",
      icon: DollarSign,
    },
    {
      label: "Platform Members",
      value: s ? s.memberCount || 0 : "—",
      sub: s ? `${s.planCount || 0} active plans` : "Loading…",
      icon: Users,
    },
    {
      label: "Transactions",
      value: s ? s.transactionCount || 0 : "—",
      sub: "All-time ledger entries",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bento-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {label}
              </span>
              <span className="h-9 w-9 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-[var(--accent-text)]">
                <Icon className="w-4 h-4" />
              </span>
            </div>
            <div className="font-mono text-2xl font-bold text-[var(--text-bright)]">
              {value}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 min-w-0">
          <MonthlyRevenueAreaChart monthly={rev?.monthly || []} />
        </div>
        <div className="lg:col-span-5 min-w-0">
          <OrgStatusDonutChart organizations={s?.organizations || {}} />
        </div>
      </div>

      <UserCard />

      {/* Quick Launch Grid */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base font-bold text-[var(--text-bright)]">
            Quick Navigation
          </h2>
          <Link
            to="/admin/stats"
            className="text-xs font-semibold text-[var(--accent-text)] hover:underline inline-flex items-center gap-1"
          >
            Full overview
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map(({ to, title, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group glass-inner p-4 flex items-start gap-4 hover:border-purple-500/45 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 flex items-center justify-center text-[var(--accent-text)] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-[var(--text-bright)] group-hover:text-[var(--accent-text)] transition-colors">
                    {title}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-text)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformDashboard;
