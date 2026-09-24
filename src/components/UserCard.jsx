import useAuth from "../hooks/useAuth";

const roleLabel = {
  platform_admin: "Platform Admin",
  org_admin: "Organization Admin",
  org_member: "Organization Member",
};

const UserCard = () => {
  const { backendUser } = useAuth();

  if (!backendUser) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">Signed in as</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="text-slate-500">Name</dt>
          <dd className="text-slate-900 font-medium">{backendUser.name}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Email</dt>
          <dd className="text-slate-900 font-medium">{backendUser.email}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Role</dt>
          <dd className="text-slate-900 font-medium">
            {roleLabel[backendUser.role] || backendUser.role}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Organization</dt>
          <dd className="text-slate-900 font-medium">
            {backendUser.orgId ? backendUser.orgId : "Platform"}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default UserCard;