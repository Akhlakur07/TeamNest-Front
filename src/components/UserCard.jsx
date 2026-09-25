import useAuth from "../hooks/useAuth";

const roleLabel = {
  platform_admin: "Platform Admin",
  org_admin: "Organization Admin",
  org_member: "Organization Member",
};

const roleColor = {
  platform_admin: "from-violet-500 to-purple-600",
  org_admin: "from-indigo-500 to-blue-600",
  org_member: "from-emerald-500 to-teal-600",
};

const UserCard = () => {
  const { backendUser, backendOrg } = useAuth();

  if (!backendUser) return null;

  const initials = backendUser.name
    ? backendUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleColor[backendUser.role] || "from-slate-500 to-slate-600"} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{backendUser.name}</p>
          <p className="text-xs text-slate-400">{backendUser.email}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <div className="glass-inner rounded-lg p-3">
          <dt className="text-xs text-slate-500 mb-0.5">Role</dt>
          <dd className="text-sm font-medium text-slate-200">
            {roleLabel[backendUser.role] || backendUser.role}
          </dd>
        </div>
        <div className="glass-inner rounded-lg p-3">
          <dt className="text-xs text-slate-500 mb-0.5">Organization</dt>
          <dd className="text-sm font-medium text-slate-200">
            {backendOrg ? backendOrg.name : "Platform"}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default UserCard;