import { useQuery } from "@tanstack/react-query";
import PanelShell from "../../components/PanelShell";
import UserCard from "../../components/UserCard";
import LogoutButton from "../../components/LogoutButton";
import apiClient from "../../utils/apiClient";
import { cardClass } from "../../utils/ui";

const MemberDashboard = () => {
  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient.get("/members").then((r) => r.data),
  });

  const { org, members } = membersQuery.data || {};

  return (
    <PanelShell
      title="Organization Member"
      subtitle="Your profile and a read-only view of your organization."
      navItems={["Profile", "Organization info"]}
    >
      <div className="flex items-center justify-end">
        <LogoutButton />
      </div>
      <UserCard />

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Organization</h2>
        {membersQuery.isLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <>
            <p className="text-sm text-slate-900 font-medium">{org?.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Status {org?.status} • {org?.memberCount}/{org?.maxMembers} members
            </p>
            <ul className="mt-3 divide-y divide-slate-100 text-sm">
              {members?.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-slate-900 font-medium">{m.name}</div>
                    <div className="text-slate-500">{m.email}</div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      m.role === "org_admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {m.role}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </PanelShell>
  );
};

export default MemberDashboard;