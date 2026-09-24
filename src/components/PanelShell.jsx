const PanelShell = ({ title, subtitle, navItems = [], children }) => (
  <div className="max-w-5xl mx-auto px-4 py-10">
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>

    {navItems.length > 0 && (
      <nav className="flex flex-wrap gap-2 mb-6">
        {navItems.map((item) =>
          typeof item === "string" ? (
            <span
              key={item}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {item}
            </span>
          ) : (
            <span
              key={item.label}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {item.label}
            </span>
          )
        )}
      </nav>
    )}

    <div className="space-y-4">{children}</div>
  </div>
);

export default PanelShell;