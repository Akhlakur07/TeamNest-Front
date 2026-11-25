import { Link } from "react-router";
import { Sparkles } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Product: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Security", href: "/#features" },
      { label: "Workflow", href: "/#how-it-works" },
    ],
    Company: [
      { label: "About", href: "/#about" },
      { label: "Get started", href: "/register" },
      { label: "Sign in", href: "/login" },
      { label: "Status", href: "/registration/status" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/#about" },
      { label: "Terms of Service", href: "/#about" },
      { label: "Security SLA", href: "/#features" },
    ],
  };

  return (
    <footer
      className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-deep)]/60 backdrop-blur-xl"
      id="footer"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/25 on-accent">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-[var(--text-bright)]">
                Team<span className="gradient-text">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              Multi-tenant organization workspaces engineered for clarity, role security, and
              automated Stripe billing.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)] font-mono">
            © {year} TeamNest. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Gray · Silver · Purple Design System
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
