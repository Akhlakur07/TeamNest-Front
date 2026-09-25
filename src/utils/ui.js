// ─── Button classes ────────────────────────────────────────────
export const btnPrimary = "btn-primary";
export const btnSecondary = "btn-secondary";

// ─── Form classes ──────────────────────────────────────────────
export const inputClass = "input-glass";
export const labelClass = "label-glass";

// ─── Layout ────────────────────────────────────────────────────
export const cardClass = "glass-card p-8";
export const pageContainer = "max-w-5xl mx-auto px-4 py-10";
export const authContainer =
  "min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-animated relative overflow-hidden";

// ─── Formatters ────────────────────────────────────────────────
export const formatPrice = (cents, currency = "usd") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

// ─── Status badge styles ───────────────────────────────────────
export const statusStyle = {
  ACTIVE:    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  PENDING:   "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  SUSPENDED: "bg-red-500/20 text-red-400 border border-red-500/30",
  CANCELLED: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  TRIAL:     "bg-sky-500/20 text-sky-400 border border-sky-500/30",
};