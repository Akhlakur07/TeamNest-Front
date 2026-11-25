// ─── Button classes ────────────────────────────────────────────
export const btnPrimary = "btn-primary";
export const btnSecondary = "btn-secondary";

// ─── Form classes ──────────────────────────────────────────────
export const inputClass = "input-glass";
export const labelClass = "label-glass";

// ─── Layout ────────────────────────────────────────────────────
export const cardClass = "glass-card p-6 sm:p-7";
export const pageContainer = "max-w-6xl mx-auto px-4 py-10";
export const authContainer =
  "min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-animated relative overflow-hidden";

// ─── Formatters ────────────────────────────────────────────────
export const formatPrice = (cents, currency = "usd") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

// ─── Status badge styles ───────────────────────────────────────
export const statusStyle = {
  ACTIVE:    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  PENDING:   "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  SUSPENDED: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  CANCELLED: "bg-slate-500/15 text-slate-400 border border-slate-500/30",
  TRIAL:     "bg-purple-500/15 text-purple-300 border border-purple-500/30",
};
