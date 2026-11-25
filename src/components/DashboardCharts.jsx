import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useTheme from "../hooks/useTheme";
import { formatPrice } from "../utils/ui";

const STATUS_META = {
  ACTIVE: { label: "Active", color: "#10B981" },
  PENDING: { label: "Pending", color: "#F59E0B" },
  TRIAL: { label: "Trial", color: "#8B5CF6" },
  SUSPENDED: { label: "Suspended", color: "#F43F5E" },
  CANCELLED: { label: "Cancelled", color: "#64748B" },
};

const PLAN_COLORS = ["#8B5CF6", "#A78BFA", "#10B981", "#38BDF8", "#F59E0B"];

const TYPE_PILL_LABELS = {
  checkout: "Checkout",
  renewal: "Renewal",
  upgrade: "Upgrade",
  downgrade: "Downgrade",
  cancel: "Cancel",
  refund: "Refund",
};

function useChartPalette() {
  const { isDark } = useTheme();
  return {
    isDark,
    grid: isDark ? "rgba(217, 218, 220, 0.1)" : "rgba(40, 45, 49, 0.1)",
    axis: isDark ? "#9DA3A9" : "#5B636B",
    accent: isDark ? "#8B5CF6" : "#7C3AED",
    accentSoft: isDark ? "rgba(139, 92, 246, 0.36)" : "rgba(124, 58, 237, 0.24)",
    track: isDark ? "rgba(217, 218, 220, 0.12)" : "rgba(40, 45, 49, 0.1)",
    tooltipBg: isDark ? "#1B1F23" : "#FFFFFF",
    tooltipBorder: isDark ? "rgba(217, 218, 220, 0.2)" : "rgba(40, 45, 49, 0.16)",
    tooltipText: isDark ? "#F4F5F6" : "#181B1F",
  };
}

function buildSixMonthSeries(monthly = []) {
  const map = new Map(monthly.map((m) => [m._id, m.revenue || 0]));
  const now = new Date();
  const points = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    const cents = map.get(key) || 0;
    points.push({
      key,
      label,
      cents,
      dollars: Number((cents / 100).toFixed(2)),
    });
  }
  return points;
}

const CurrencyTooltip = ({ active, payload, label, palette }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const cents = item.payload?.cents ?? Math.round((item.value || 0) * 100);
  const count = item.payload?.count;
  return (
    <div
      className="rounded-xl px-3.5 py-2.5 text-xs shadow-xl"
      style={{
        backgroundColor: palette.tooltipBg,
        border: `1px solid ${palette.tooltipBorder}`,
        color: palette.tooltipText,
      }}
    >
      <div className="font-semibold mb-1">{label || item.name}</div>
      <div className="font-mono font-bold text-purple-400">{formatPrice(cents)}</div>
      {typeof count === "number" && (
        <div className="text-[11px] opacity-75 mt-0.5">{count} charge(s)</div>
      )}
    </div>
  );
};

const CountTooltip = ({ active, payload, palette }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{
        backgroundColor: palette.tooltipBg,
        border: `1px solid ${palette.tooltipBorder}`,
        color: palette.tooltipText,
      }}
    >
      <span className="font-semibold">{item.name}: </span>
      <span className="font-mono font-bold">{item.value}</span>
    </div>
  );
};

export const MonthlyRevenueAreaChart = ({
  monthly = [],
  title = "Monthly revenue trend",
  subtitle = "Last 6 months (USD)",
}) => {
  const palette = useChartPalette();
  const data = buildSixMonthSeries(monthly);

  return (
    <div className="glass-card p-6 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="font-display text-base font-bold text-[var(--text-bright)]">{title}</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
        </div>
        <span className="font-mono text-xs font-semibold text-[var(--accent-text)] bg-purple-500/15 border border-purple-500/30 rounded-full px-3 py-1">
          6M View
        </span>
      </div>

      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height={256} minWidth={0}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tnRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.accent} stopOpacity={0.45} />
                <stop offset="95%" stopColor={palette.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: palette.axis, fontSize: 11, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: palette.axis, fontSize: 11, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              width={56}
            />
            <Tooltip content={<CurrencyTooltip palette={palette} />} />
            <Area
              type="monotone"
              dataKey="dollars"
              stroke={palette.accent}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tnRevenueGradient)"
              isAnimationActive={false}
              activeDot={{ r: 5, fill: palette.accent, strokeWidth: 2, stroke: "#FFFFFF" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const OrgStatusDonutChart = ({
  organizations = {},
  title = "Organizations by status",
  subtitle = "Live tenant lifecycle distribution",
}) => {
  const palette = useChartPalette();
  const entries = Object.entries(STATUS_META)
    .map(([key, meta]) => ({
      key,
      name: meta.label,
      value: organizations[key] || 0,
      color: meta.color,
    }))
    .filter((d) => d.value > 0);

  const total =
    organizations.total ??
    entries.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass-card p-6 min-w-0 flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="font-display text-base font-bold text-[var(--text-bright)]">{title}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
      </div>

      {entries.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-[var(--text-muted)]">
          No organization status data yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="relative h-52 w-full min-w-0">
            <ResponsiveContainer width="100%" height={208} minWidth={0}>
              <PieChart>
                <Pie
                  data={entries}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {entries.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CountTooltip palette={palette} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold text-[var(--text-bright)]">
                {total}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Total
              </span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs">
            {entries.map((item) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-2 glass-inner px-3 py-2"
                >
                  <span className="flex items-center gap-2 font-semibold text-[var(--text-bright)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="font-mono text-[var(--text-muted)]">
                    <strong className="text-[var(--text-bright)]">{item.value}</strong> ({pct}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export const RevenueByPlanBarChart = ({
  byPlan = [],
  title = "Revenue by plan",
  subtitle = "Collected subscription charges per tier",
}) => {
  const palette = useChartPalette();
  const data = byPlan.map((p, idx) => ({
    name: p.planName,
    cents: p.revenue || 0,
    dollars: Number(((p.revenue || 0) / 100).toFixed(2)),
    count: p.count || 0,
    color: PLAN_COLORS[idx % PLAN_COLORS.length],
  }));

  return (
    <div className="glass-card p-6 min-w-0">
      <div className="mb-5">
        <h2 className="font-display text-base font-bold text-[var(--text-bright)]">{title}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-[var(--text-muted)]">
          No plan revenue recorded yet.
        </div>
      ) : (
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height={256} minWidth={0}>
            <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: palette.axis, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: palette.axis, fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                width={56}
              />
              <Tooltip content={<CurrencyTooltip palette={palette} />} />
              <Bar dataKey="dollars" radius={[8, 8, 0, 0]} maxBarSize={56} isAnimationActive={false}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export const SeatCapacityChart = ({
  memberCount = 0,
  maxMembers = 50,
  members = [],
  title = "Seat utilization & roles",
  subtitle = "Workspace member capacity breakdown",
}) => {
  const palette = useChartPalette();
  const safeMax = Math.max(1, maxMembers || 1);
  const used = Math.max(0, memberCount || 0);
  const available = Math.max(0, safeMax - used);
  const pct = Math.min(100, Math.round((used / safeMax) * 100));

  const gaugeData = [
    { name: "Used seats", value: used, color: palette.accent },
    { name: "Available seats", value: available, color: palette.track },
  ];

  const adminCount = members.filter((m) => m.role === "org_admin").length;
  const memberOnlyCount = members.filter((m) => m.role === "org_member").length;
  const roleTotal = Math.max(1, adminCount + memberOnlyCount);
  const adminPct = Math.round((adminCount / roleTotal) * 100);

  return (
    <div className="glass-card p-6 min-w-0 flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="font-display text-base font-bold text-[var(--text-bright)]">{title}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-5">
        <div className="relative h-48 w-full min-w-0">
          <ResponsiveContainer width="100%" height={192} minWidth={0}>
            <PieChart>
              <Pie
                data={gaugeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={74}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive={false}
              >
                {gaugeData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CountTooltip palette={palette} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-bold text-[var(--text-bright)]">{pct}%</span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              {used}/{maxMembers} seats
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="glass-inner px-3.5 py-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-[var(--text-bright)]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: palette.accent }}
              />
              Org Admins
            </span>
            <span className="font-mono font-bold text-[var(--text-bright)]">{adminCount}</span>
          </div>
          <div className="glass-inner px-3.5 py-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-[var(--text-bright)]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Org Members
            </span>
            <span className="font-mono font-bold text-[var(--text-bright)]">{memberOnlyCount}</span>
          </div>
          <div className="glass-inner px-3.5 py-2.5 flex items-center justify-between">
            <span className="font-medium text-[var(--text-muted)]">Remaining seats</span>
            <span className="font-mono font-bold text-[var(--text-bright)]">{available}</span>
          </div>
        </div>
      </div>

      {/* Role split bar */}
      <div className="pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1.5">
          <span>Role mix</span>
          <span className="font-mono">
            {adminPct}% admin · {100 - adminPct}% member
          </span>
        </div>
        <div className="h-2 w-full rounded-full overflow-hidden bg-emerald-500/35 flex">
          <div
            className="h-full bg-purple-500"
            style={{ width: `${adminPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const FinancialBreakdownBarChart = ({
  grossCents = 0,
  refundsCents = 0,
  netCents = 0,
  byType = null,
  labels = ["Gross", "Refunds", "Net"],
  title = "Financial summary",
  subtitle = "Collected vs. refunded & net totals (USD)",
}) => {
  const palette = useChartPalette();
  const data = [
    {
      name: labels[0],
      cents: grossCents,
      dollars: Number((grossCents / 100).toFixed(2)),
      color: palette.accent,
    },
    {
      name: labels[1],
      cents: refundsCents,
      dollars: Number((refundsCents / 100).toFixed(2)),
      color: "#F43F5E",
    },
    {
      name: labels[2],
      cents: netCents,
      dollars: Number((netCents / 100).toFixed(2)),
      color: "#10B981",
    },
  ];

  const typeEntries = byType
    ? Object.entries(byType).filter(([, count]) => count > 0)
    : [];

  return (
    <div className="glass-card p-6 min-w-0 flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="font-display text-base font-bold text-[var(--text-bright)]">{title}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>
      </div>

      <div className="h-52 w-full min-w-0">
        <ResponsiveContainer width="100%" height={208} minWidth={0}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: palette.axis, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: palette.axis, fontSize: 11, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              width={56}
            />
            <Tooltip content={<CurrencyTooltip palette={palette} />} />
            <Bar dataKey="dollars" radius={[8, 8, 0, 0]} maxBarSize={56} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {typeEntries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
          {typeEntries.map(([type, count]) => (
            <span
              key={type}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)]"
            >
              <span>{TYPE_PILL_LABELS[type] || type}</span>
              <strong className="text-[var(--text-bright)]">{count}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
