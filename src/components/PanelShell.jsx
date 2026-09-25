import { Link, useLocation } from "react-router";

const PanelShell = ({ title, subtitle, navItems = [], rightAction, children }) => {
  const { pathname } = useLocation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {rightAction && (
          <div className="flex items-center gap-3">{rightAction}</div>
        )}
      </div>

      {/* Navigation tabs */}
      {navItems.length > 0 && (
        <nav className="flex flex-wrap gap-1.5 mb-8 p-1.5 glass-inner rounded-2xl w-fit border border-white/10 backdrop-blur-xl">
          {navItems.map((item) => {
            if (typeof item === "object" && item.to) {
              const isDashboard = item.to === "/admin" || item.to === "/org";
              const isActive = isDashboard
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(`${item.to}/`);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            const label = typeof item === "string" ? item : item.label;
            return (
              <span
                key={label}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 bg-white/5"
              >
                {label}
              </span>
            );
          })}
        </nav>
      )}

      {/* Content */}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default PanelShell;