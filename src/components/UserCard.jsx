import { ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";

const roleLabel = {
  platform_admin: "Platform Admin",
  org_admin: "Organization Admin",
  org_member: "Organization Member",
};

const roleColor = {
  platform_admin: "from-purple-500 to-violet-700",
  org_admin: "from-violet-500 to-purple-700",
  org_member: "from-emerald-500 to-teal-600",
};

const UserCard = () => {
  const { backendUser, backendOrg } = useAuth();

  if (!backendUser) return null;

  const initials = backendUser.name
    ? backendUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="glass-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${roleColor[backendUser.role] || "from-slate-500 to-slate-600"} flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0 shadow-lg shadow-purple-500/20 on-accent`}
          >
            {initials}
          </div>
          <div>
            <p className="font-display text-base font-bold text-[var(--text-bright)]">
              {backendUser.name}
            </p>
            <p className="text-xs text-[var(--text-muted)] font-mono">{backendUser.email}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-[var(--accent-text)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          {roleLabel[backendUser.role] || backendUser.role}
        </span>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-inner p-3.5">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Role
          </dt>
          <dd className="text-sm font-semibold text-[var(--text-bright)]">
            {roleLabel[backendUser.role] || backendUser.role}
          </dd>
        </div>
        <div className="glass-inner p-3.5">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Organization
          </dt>
          <dd className="text-sm font-semibold text-[var(--text-bright)]">
            {backendOrg ? backendOrg.name : "Platform"}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default UserCard;
