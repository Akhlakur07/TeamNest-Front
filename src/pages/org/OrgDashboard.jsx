import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Layers,
  Receipt,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import UserCard from "../../components/UserCard";
import {
  FinancialBreakdownBarChart,
  SeatCapacityChart,
} from "../../components/DashboardCharts";
import apiClient from "../../utils/apiClient";
import useAuth from "../../hooks/useAuth";
import { cardClass, btnPrimary, formatPrice } from "../../utils/ui";

const quickActions = [
  {
    to: "/org/profile",
    title: "Workspace Profile",
    desc: "Update organization contact information, phone, and billing email.",
    icon: Settings,
  },
  {
    to: "/org/members",
    title: "Team Members",
    desc: "Invite teammates, manage pending links, and adjust member roles.",
    icon: Users,
  },
  {
    to: "/org/subscription",
    title: "Subscription Plan",
    desc: "Upgrade, switch tiers, or manage renewal settings via Stripe.",
    icon: CreditCard,
  },
  {
    to: "/org/transactions",
    title: "Billing & Invoices",
    desc: "Inspect payment history, download invoices, and export CSV ledgers.",
    icon: Receipt,
  },
];

const OrgDashboard = () => {
  const { backendOrg, fetchProfile } = useAuth();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const isPending = backendOrg?.status === "PENDING";

  const statusQuery = useQuery({
    queryKey: ["registration", "status"],
    queryFn: () => apiClient.get("/auth/registration-status").then((r) => r.data),
    enabled: isPending,
    refetchInterval: isPending ? 3000 : false,
    refetchIntervalInBackground: true,
  });

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient.get("/members").then((r) => r.data),
  });

  const billingQuery = useQuery({
    queryKey: ["billing", "current"],
    queryFn: () => apiClient.get("/billing/current").then((r) => r.data),
  });

  const txQuery = useQuery({
    queryKey: ["transactions", "summary"],
    queryFn: () => apiClient.get("/transactions").then((r) => r.data),
  });

  useEffect(() => {
    if (isPending && statusQuery.data?.org?.status === "ACTIVE") {
      fetchProfile();
    }
  }, [isPending, statusQuery.data?.org?.status, fetchProfile]);

  const handlePayNow = async () => {
    setPaying(true);
    setPayError("");
    try {
      const { data } = await apiClient.post("/auth/retry-checkout");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setPaying(false);
        await fetchProfile();
      }
    } catch (err) {
      setPayError(err?.response?.data?.message || "Could not start payment.");
      setPaying(false);
    }
  };

  const orgMeta = membersQuery.data?.org;
  const membersList = membersQuery.data?.members || [];
  const billing = billingQuery.data;
  const txSummary = txQuery.data?.summary;
  const plan = billing?.plan;
  const sub = billing?.subscription;

  const kpis = [
    {
      label: "Current Plan",
      value: plan ? plan.name : "—",
      sub: plan
        ? `${formatPrice(plan.priceCents, plan.currency)}${plan.billingInterval === "yearly" ? "/year" : "/month"}`
        : "Loading…",
      icon: Layers,
    },
    {
      label: "Team Capacity",
      value: orgMeta ? `${orgMeta.memberCount}/${orgMeta.maxMembers}` : "—",
      sub: "Active seats used",
      icon: Users,
    },
    {
      label: "Subscription",
      value: sub?.status || backendOrg?.status || "—",
      sub: sub?.canceledAt ? "Cancels at period end" : "Auto-renewal status",
      icon: Wallet,
    },
    {
      label: "Next Renewal",
      value: sub?.currentPeriodEnd
        ? new Date(sub.currentPeriodEnd).toLocaleDateString()
        : "—",
      sub: "Billing cycle end",
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      {isPending && (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Payment pending activation
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Your organization is not active yet. Complete payment to activate your workspace.
              </p>
              {payError && <p className="text-sm text-rose-400 mt-1">{payError}</p>}
            </div>
            <button type="button" className={btnPrimary} onClick={handlePayNow} disabled={paying}>
              {paying ? "Starting..." : "Complete payment"}
            </button>
          </div>
        </div>
      )}

      {/* Workspace KPI Bento Grid */}
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

      {/* Workspace Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 min-w-0">
          <SeatCapacityChart
            memberCount={orgMeta?.memberCount || 0}
            maxMembers={orgMeta?.maxMembers || 50}
            members={membersList}
          />
        </div>
        <div className="lg:col-span-7 min-w-0">
          <FinancialBreakdownBarChart
            grossCents={txSummary?.collected || 0}
            refundsCents={txSummary?.refunded || 0}
            netCents={txSummary?.net || 0}
            byType={txSummary?.byType || null}
            labels={["Collected", "Refunds", "Net"]}
            title="Organization billing ledger"
            subtitle="Summary of collected charges, refunds, and transaction activity"
          />
        </div>
      </div>

      <UserCard />

      {/* Workspace Quick Launch */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base font-bold text-[var(--text-bright)]">
            Workspace Shortcuts
          </h2>
          <Link
            to="/org/billing"
            className="text-xs font-semibold text-[var(--accent-text)] hover:underline inline-flex items-center gap-1"
          >
            Billing overview
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map(({ to, title, desc, icon: Icon }) => (
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

export default OrgDashboard;
