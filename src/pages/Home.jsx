import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Lottie } from "lottie-react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CreditCard,
  KeyRound,
  Layers,
  Lock,
  Receipt,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import roleHome from "../utils/roles";
import apiClient from "../utils/apiClient";
import { formatPrice } from "../utils/ui";
import heroAnimation from "../assets/lottie/hero_lottie.json";

const CAROUSEL_ITEMS = [
  { icon: Layers, title: "Isolated Tenant Workspaces", tag: "ORG SCOPED" },
  { icon: CreditCard, title: "Stripe Checkout & Billing Portal", tag: "PAYMENTS" },
  { icon: ShieldCheck, title: "Platform, Admin & Member Portals", tag: "RBAC" },
  { icon: Zap, title: "Expiring Single-Link Invitations", tag: "ONBOARDING" },
  { icon: BarChart3, title: "Revenue & Seat Analytics", tag: "CHARTS" },
  { icon: Receipt, title: "Auditable CSV Ledger Export", tag: "TRANSACTIONS" },
  { icon: Building2, title: "Org Suspend & Reactivate", tag: "LIFECYCLE" },
  { icon: Lock, title: "Firebase Auth + JWT Verification", tag: "SECURITY" },
];

const CAPABILITIES = [
  {
    num: "01",
    icon: CreditCard,
    title: "Stripe-Native Subscriptions",
    description:
      "Hosted Checkout onboarding, instant plan upgrades with proration, period-end cancellations, and idempotent webhooks.",
  },
  {
    num: "02",
    icon: Zap,
    title: "Expiring Invite Links",
    description:
      "Invite teammates via secure token URLs with automatic seat-limit validation and instant revoke controls.",
  },
  {
    num: "03",
    icon: Receipt,
    title: "Exportable Revenue Ledger",
    description:
      "Every checkout, renewal, upgrade, and refund is recorded in an auditable ledger with CSV export.",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Create your organization",
    description:
      "Register your tenant workspace, choose Free or a paid Stripe tier, and go live immediately.",
  },
  {
    step: "02",
    title: "Invite your team",
    description:
      "Send single-link invitations, assign Org Admin or Member roles, and track capacity in real time.",
  },
  {
    step: "03",
    title: "Scale & audit billing",
    description:
      "Upgrade plans anytime, download transaction CSVs, and manage cards inside Stripe Billing Portal.",
  },
];

const Home = () => {
  const { user, backendUser, loading } = useAuth();

  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiClient.get("/plans").then((r) => r.data.plans),
  });
  const plans = plansQuery.data || [];
  const isAuthenticated = Boolean(user && backendUser);
  const dashboardTarget = backendUser ? roleHome(backendUser.role) : "/login";

  return (
    <div className="overflow-x-hidden">
      {/* ═══ BAND 1: OBSIDIAN / CRISP HERO (No grid/graph) ═══════ */}
      <section
        id="hero"
        className="band-obsidian relative py-18 sm:py-25 px-4 sm:px-6 border-b border-[var(--band-border)]"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Editorial Left */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--band-accent)] mb-7">
              <Sparkles className="w-3.5 h-3.5" />
              MULTI-TENANT WORKSPACE PLATFORM
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold text-[var(--band-heading)] leading-[1.03] tracking-tight mb-6">
              One platform.{" "}
              <span className="gradient-text block sm:inline">
                Isolated workspaces.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-[var(--band-body)] max-w-2xl mx-auto lg:mx-0 mb-9 leading-relaxed">
              Give every organization its own private tenant space — complete with role-based access
              control, single-link team invitations, and automated Stripe subscription billing.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {loading ? null : isAuthenticated ? (
                <Link
                  to={dashboardTarget}
                  className="btn-primary text-sm sm:text-base !py-3.5 !px-8"
                  id="hero-dashboard-btn"
                >
                  Go to dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-sm sm:text-base !py-3.5 !px-8"
                    id="hero-register-btn"
                  >
                    Start for free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-sm sm:text-base !py-3.5 !px-8"
                    id="hero-login-btn"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-[var(--band-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Tenant Data Isolation
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                Stripe Checkout & Webhooks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Firebase + RBAC Enforcement
              </span>
            </div>
          </div>

          {/* Hero Lottie Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Lottie
              src={heroAnimation}
              loop
              autoplay
              className="w-full max-w-lg mx-auto drop-shadow-2xl"
              aria-label="TeamNest workspace illustration"
            />
          </div>
        </div>
      </section>

      {/* ═══ BAND 2: GRAY INFINITE CAROUSEL ════════════════════ */}
      <section
        aria-label="Platform capabilities carousel"
        className="band-obsidian py-7 border-b border-[var(--band-border)]"
      >
        <div className="marquee-viewport">
          <div className="marquee-track">
            {[0, 1].map((pass) => (
              <div
                key={pass}
                aria-hidden={pass === 1}
                className="flex items-center gap-5 shrink-0"
              >
                {CAROUSEL_ITEMS.map(({ icon: Icon, title, tag }) => (
                  <div
                    key={`${pass}-${title}`}
                    className="flex items-center gap-3.5 rounded-2xl border border-[var(--band-border)] bg-[var(--band-card)] px-4 py-3 shadow-sm shrink-0"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 text-white shrink-0 on-accent">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="leading-tight">
                      <div className="font-display text-sm font-bold text-[var(--band-heading)] whitespace-nowrap">
                        {title}
                      </div>
                      <div className="font-mono text-[10px] font-bold tracking-widest text-[var(--band-accent)] mt-0.5">
                        {tag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BAND 3: GRAY CAPABILITIES SHOWCASE ══════════════════ */}
      <section id="features" className="band-obsidian py-24 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Editorial Asymmetric Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-14">
            <div className="lg:col-span-7 border-l-4 border-purple-500 pl-5">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--band-accent)]">
                Architecture & Capabilities
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-[var(--band-heading)] mt-2 leading-tight">
                Engineered for strict tenant separation
              </h2>
            </div>
            <p className="lg:col-span-5 text-sm sm:text-base text-[var(--band-body)] leading-relaxed">
              Every organization gets clean isolation from signup to invoicing — no shared member
              tables, no leaked transactions, and zero manual billing wiring.
            </p>
          </div>

          {/* Spotlight Architectural Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Tenant Isolation Spotlight */}
            <div className="lg:col-span-7 rounded-3xl border border-[var(--band-border)] bg-[var(--band-card)] p-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-purple-600/20 border border-purple-500/35 px-3 py-1.5 text-xs font-semibold text-[var(--band-accent)] mb-4">
                  <Layers className="w-4 h-4" />
                  Tenant Boundary Isolation
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--band-heading)] mb-2">
                  Dedicated workspace boundaries per organization
                </h3>
                <p className="text-sm text-[var(--band-body)] mb-6 max-w-xl">
                  Users, invitations, subscriptions, and payment ledgers are scoped by{" "}
                  <code className="font-mono text-xs text-[var(--band-accent)]">orgId</code> at
                  every API boundary.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Acme Corp", tier: "Enterprise", status: "ACTIVE", seats: "42 seats" },
                  { name: "Nova Labs", tier: "Pro", status: "ACTIVE", seats: "18 seats" },
                ].map((tenant) => (
                  <div
                    key={tenant.name}
                    className="rounded-2xl border border-[var(--band-border)] bg-[var(--band-card-inner)] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 text-white font-bold text-xs flex items-center justify-center on-accent">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <span className="font-display font-bold text-sm text-[var(--band-heading)]">
                          {tenant.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-emerald-400">
                        {tenant.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--band-muted)] pt-2 border-t border-[var(--band-border)]">
                      <span>{tenant.tier}</span>
                      <span>{tenant.seats}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RBAC Matrix Spotlight */}
            <div className="lg:col-span-5 rounded-3xl border border-[var(--band-border)] bg-[var(--band-card)] p-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-purple-600/20 border border-purple-500/35 px-3 py-1.5 text-xs font-semibold text-[var(--band-accent)] mb-4">
                  <KeyRound className="w-4 h-4" />
                  Role-Based Access Control
                </div>
                <h3 className="font-display text-2xl font-bold text-[var(--band-heading)] mb-2">
                  Three distinct portals
                </h3>
                <p className="text-sm text-[var(--band-body)] mb-5">
                  Strict route and middleware checks keep platform, admin, and member scopes cleanly
                  separated.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--band-border)] bg-[var(--band-card-inner)] overflow-hidden text-xs">
                <div className="grid grid-cols-4 px-4 py-2.5 border-b border-[var(--band-border)] font-mono font-bold text-[var(--band-muted)]">
                  <span>Scope</span>
                  <span className="text-center">Platform</span>
                  <span className="text-center">Admin</span>
                  <span className="text-center">Member</span>
                </div>
                {[
                  { cap: "Manage Plans", p: true, a: false, m: false },
                  { cap: "Invite Users", p: false, a: true, m: false },
                  { cap: "Billing Portal", p: false, a: true, m: false },
                  { cap: "Team Profile", p: true, a: true, m: true },
                ].map((row) => (
                  <div
                    key={row.cap}
                    className="grid grid-cols-4 px-4 py-2.5 border-b last:border-b-0 border-[var(--band-border)] items-center"
                  >
                    <span className="font-semibold text-[var(--band-heading)]">{row.cap}</span>
                    {[row.p, row.a, row.m].map((ok, i) => (
                      <span key={i} className="flex justify-center">
                        {ok ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[var(--band-muted)]">—</span>
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Numbered Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAPABILITIES.map(({ num, icon: Icon, title, description }) => (
              <div
                key={num}
                className="rounded-3xl border border-[var(--band-border)] bg-[var(--band-card)] p-7 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 on-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-[var(--band-muted)] opacity-55">
                    {num}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-[var(--band-heading)] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--band-body)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BAND 4: FULL-BLEED PURPLE WORKFLOW ══════════════════ */}
      <section id="how-it-works" className="band-purple py-24 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-purple-200">
              How It Works
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mt-2">
              From signup to active team in three steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORKFLOW_STEPS.map(({ step, title, description }) => (
              <div
                key={step}
                className="rounded-3xl border border-white/20 bg-black/20 backdrop-blur-md p-7 flex flex-col justify-between"
              >
                <div className="font-mono text-4xl font-bold text-white/30 mb-6">{step}</div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2.5">{title}</h3>
                  <p className="text-sm text-purple-100 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BAND 5: LIVE PRICING SHOWCASE ═══════════════════════ */}
      <section id="pricing" className="band-obsidian py-24 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--band-accent)]">
              Transparent Plans
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[var(--band-heading)] mt-2 mb-4">
              Choose the tier that fits your team
            </h2>
            <p className="text-[var(--band-body)]">
              Live plans synchronized from TeamNest &amp; Stripe. Switch tiers or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plansQuery.isLoading ? (
              [1, 2, 3].map((i) => <div key={i} className="glass-card p-7 h-80 shimmer" />)
            ) : plans.length === 0 ? (
              <p className="col-span-full text-center text-sm text-[var(--band-muted)]">
                Pricing plans are currently unavailable.
              </p>
            ) : (
              plans.map((plan) => {
                const popular = plan.slug === "pro";
                const period = plan.billingInterval === "yearly" ? "/year" : "/month";

                if (popular) {
                  return (
                    <div
                      key={plan.id}
                      className="pricing-card-featured rounded-3xl p-8 relative flex flex-col"
                    >
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-violet-700 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg on-accent">
                        Most popular
                      </div>
                      <h3 className="font-display text-xl font-bold text-[var(--feat-heading)] mb-1">
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <p className="text-xs text-[var(--feat-muted)] mb-5">{plan.description}</p>
                      )}
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="font-mono text-4xl font-bold text-[var(--feat-heading)]">
                          {formatPrice(plan.priceCents, plan.currency)}
                        </span>
                        <span className="font-mono text-xs text-[var(--feat-muted)]">{period}</span>
                      </div>
                      <ul className="space-y-3 mb-8 text-sm text-[var(--feat-body)] flex-1">
                        {(plan.features || []).map((f) => (
                          <li key={f} className="flex items-center gap-2.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shrink-0 on-accent">
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="font-medium">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/register?plan=${plan.id}`}
                        className="btn-primary w-full text-center !py-3"
                        id={`pricing-${plan.slug}-btn`}
                      >
                        Get started with {plan.name}
                      </Link>
                    </div>
                  );
                }

                return (
                  <div
                    key={plan.id}
                    className="rounded-3xl border border-[var(--band-border)] bg-[var(--band-card)] p-8 flex flex-col"
                  >
                    <h3 className="font-display text-xl font-bold text-[var(--band-heading)] mb-1">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p className="text-xs text-[var(--band-muted)] mb-5">{plan.description}</p>
                    )}
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="font-mono text-4xl font-bold text-[var(--band-heading)]">
                        {formatPrice(plan.priceCents, plan.currency)}
                      </span>
                      <span className="font-mono text-xs text-[var(--band-muted)]">{period}</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-[var(--band-body)] flex-1">
                      {(plan.features || []).map((f) => (
                        <li key={f} className="flex items-center gap-2.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/register?plan=${plan.id}`}
                      className="btn-secondary w-full text-center !py-3"
                      id={`pricing-${plan.slug}-btn`}
                    >
                      Get started
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ═══ BAND 6: CONTRASTING SILVER CLOSING CTA ══════════════ */}
      <section id="about" className="band-silver py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[var(--band-accent)] mb-3">
              <UserCheck className="w-4 h-4" />
              Ready in under 60 seconds
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[var(--band-heading)] leading-tight">
              Launch your isolated workspace today
            </h2>
            <p className="text-base text-[var(--band-body)] mt-4 max-w-xl">
              Start on the Free tier with up to 50 seats or connect Stripe Checkout to scale your
              organization immediately.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row lg:items-end justify-end gap-3.5">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-base !py-3.5 !px-8"
                  id="cta-register-btn"
                >
                  Create your workspace
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--band-border)] bg-[var(--band-card)] px-7 py-3.5 text-sm font-semibold text-[var(--band-heading)] hover:border-purple-500 transition-colors"
                  id="cta-login-btn"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <Link
                to={dashboardTarget}
                className="btn-primary text-base !py-3.5 !px-8"
                id="cta-dashboard-btn"
              >
                Open workspace
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
