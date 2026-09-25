import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import roleHome from "../utils/roles";

/* ─── Data ────────────────────────────────────────────────────── */
const features = [
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Multi-Tenant Workspaces",
    description:
      "Every organization gets its own fully isolated workspace — members, data, billing, and permissions stay completely separate.",
    color: "from-indigo-500 to-purple-600",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Role-Based Access",
    description:
      "Platform admins, org admins, and members each see exactly what they need. Powerful RBAC baked in from day one.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.25)",
  },
  {
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    title: "Integrated Billing",
    description:
      "Stripe-powered subscriptions with multiple plans, invoice history, and real-time payment tracking — all in one place.",
    color: "from-sky-500 to-blue-600",
    glow: "rgba(14,165,233,0.25)",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Instant Invitations",
    description:
      "Invite members with a single link. Secure token-based acceptance flow gets your team set up in seconds.",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Analytics & Insights",
    description:
      "Platform-level revenue dashboards, per-org stats, and subscription metrics give you the full picture at a glance.",
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.25)",
  },
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "Enterprise Security",
    description:
      "Firebase Authentication, JWT tokens, and per-tenant data isolation ensure your data is always protected.",
    color: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.25)",
  },
];

const stats = [
  { value: "10k+", label: "Organizations" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "150+", label: "Countries" },
  { value: "24/7", label: "Support" },
];

const steps = [
  {
    step: "01",
    title: "Create your organization",
    description: "Sign up, pick a plan, and your isolated workspace is live in under 60 seconds.",
  },
  {
    step: "02",
    title: "Invite your team",
    description: "Send invite links to any member. Role assignments are automatic and secure.",
  },
  {
    step: "03",
    title: "Collaborate & grow",
    description: "Manage members, monitor billing, and scale your subscription as you grow.",
  },
];

/* ─── Component ───────────────────────────────────────────────── */
const Home = () => {
  const { user, backendUser, loading } = useAuth();

  const dashboardTarget = backendUser
    ? roleHome(backendUser.role)
    : user
      ? "/"
      : "/login";

  return (
    <div className="overflow-x-hidden">
      {/* ═══ HERO ════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      >
        {/* Background blobs */}
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-inner border border-indigo-500/30 text-xs font-medium text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Multi-tenant collaboration platform — now in production
          </div>

          {/* Headline */}
          <h1 className="fade-in-up-1 text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
            A workspace for{" "}
            <span className="gradient-text block sm:inline">
              your whole organization
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="fade-in-up-2 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            TeamNest gives every organization an isolated space with its own members, subscription,
            and payment history — all managed from one powerful platform.
          </p>

          {/* CTAs */}
          <div className="fade-in-up-3 flex flex-wrap items-center justify-center gap-4">
            {loading ? null : user ? (
              <Link to={dashboardTarget} className="btn-primary text-base !py-3 !px-8" id="hero-dashboard-btn">
                Go to dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-base !py-3 !px-8" id="hero-register-btn">
                  Start for free →
                </Link>
                <Link to="/login" className="btn-secondary text-base !py-3 !px-8" id="hero-login-btn">
                  Log in
                </Link>
              </>
            )}
          </div>

          {/* Floating stat pills */}
          <div className="fade-in-up-4 mt-16 flex flex-wrap justify-center gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="glass-inner px-5 py-3 flex flex-col items-center hover:border-indigo-500/30 transition-all duration-300"
              >
                <span className="text-2xl font-bold gradient-text">{value}</span>
                <span className="text-xs text-slate-500 mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 animate-bounce">
          <span className="text-xs">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ═══ FEATURES ════════════════════════════════════════════ */}
      <section id="features" className="relative py-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              What you get
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything your team{" "}
              <span className="gradient-text">needs to thrive</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Purpose-built for modern teams that demand reliability, security, and scalability.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, description, color, glow }) => (
              <div
                key={title}
                className="glass-card feature-card p-7 group cursor-default"
                style={{ "--glow": glow }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}
                  style={{ boxShadow: `0 8px 24px ${glow}` }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ═══ HOW IT WORKS ════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 glow-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(60px)" }} />

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
              Getting started
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Up and running in{" "}
              <span className="gradient-text">three steps</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-[calc(50%-1px)] top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent" />

            <div className="space-y-10">
              {steps.map(({ step, title, description }, i) => (
                <div
                  key={step}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    i % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex-1 ${i % 2 !== 0 ? "md:text-right" : "md:text-left"} text-center`}>
                    <div className="glass-card p-6 inline-block max-w-sm w-full">
                      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                      <p className="text-sm text-slate-400">{description}</p>
                    </div>
                  </div>

                  {/* Step bubble */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-sm z-10">
                    {step}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ═══ PRICING TEASER ══════════════════════════════════════ */}
      <section id="pricing" className="relative py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">
            Choose a plan that fits your team. Upgrade, downgrade, or cancel any time — no lock-in.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$29", period: "/month", features: ["Up to 10 members", "5 GB storage", "Basic analytics", "Email support"], popular: false },
              { name: "Growth", price: "$79", period: "/month", features: ["Up to 50 members", "50 GB storage", "Advanced analytics", "Priority support", "Custom roles"], popular: true },
              { name: "Enterprise", price: "Custom", period: "", features: ["Unlimited members", "Unlimited storage", "Dedicated support", "SLA guarantee", "Custom integrations"], popular: false },
            ].map(({ name, price, period, features, popular }) => (
              <div
                key={name}
                className={`glass-card p-7 relative ${
                  popular
                    ? "border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                    : ""
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
                <div className="flex items-baseline gap-0.5 mb-5">
                  <span className="text-3xl font-extrabold gradient-text">{price}</span>
                  <span className="text-slate-500 text-sm">{period}</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm text-slate-400">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={popular ? "btn-primary w-full text-center" : "btn-secondary w-full text-center"}
                  id={`pricing-${name.toLowerCase()}-btn`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gradient" />

      {/* ═══ CTA BANNER ═══════════════════════════════════════════ */}
      <section id="about" className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-transparent" />
        <div className="glow-orb glow-orb-1" style={{ opacity: 0.5 }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to bring your team{" "}
            <span className="gradient-text">together?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of organizations that trust TeamNest for their daily collaboration.
            Get started in under a minute.
          </p>
          {!user && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base !py-3.5 !px-10" id="cta-register-btn">
                Create your workspace →
              </Link>
              <Link to="/login" className="btn-secondary text-base !py-3.5 !px-10" id="cta-login-btn">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;