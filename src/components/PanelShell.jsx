import { Link } from "react-router";

const PanelShell = ({ title, subtitle, navItems = [], children }) => (
  <div className="max-w-5xl mx-auto px-4 py-10">
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>

    {navItems.length > 0 && (
      <nav className="flex flex-wrap gap-2 mb-6">
        {navItems.map((item) => {
          if (typeof item === "object" && item.to) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {item.label}
              </Link>
            );
          }
          const label = typeof item === "string" ? item : item.label;
          return (
            <span
              key={label}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {label}
            </span>
          );
        })}
      </nav>
    )}

    <div className="space-y-4">{children}</div>
  </div>
);

export default PanelShell;