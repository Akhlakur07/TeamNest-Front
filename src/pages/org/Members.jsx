import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import LogoutButton from "../../components/LogoutButton";
import useAuth from "../../hooks/useAuth";
import {
  btnPrimary,
  btnSecondary,
  cardClass,
  inputClass,
  labelClass,
} from "../../utils/ui";

const roleBadge = (role) =>
  role === "org_admin"
    ? "bg-indigo-100 text-indigo-700"
    : "bg-emerald-100 text-emerald-700";

const Members = () => {
  const { backendUser } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("org_member");
  const [actionError, setActionError] = useState("");
  const [lastInvite, setLastInvite] = useState(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["members"] });

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient.get("/members").then((r) => r.data),
  });

  const invitationsQuery = useQuery({
    queryKey: ["members", "invitations"],
    queryFn: () => apiClient.get("/members/invitations").then((r) => r.data),
  });

  const invite = useMutation({
    mutationFn: () => apiClient.post("/members/invite", { email, role }),
    onSuccess: (res) => {
      setEmail("");
      setActionError("");
      setLastInvite(res.data.invite);
      invalidate();
    },
    onError: (err) =>
      setActionError(err?.response?.data?.message || "Could not send invitation."),
  });

  const revoke = useMutation({
    mutationFn: (id) => apiClient.delete(`/members/invitations/${id}`),
    onSuccess: () => {
      setActionError("");
      invalidate();
    },
    onError: (err) =>
      setActionError(err?.response?.data?.message || "Could not revoke invitation."),
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role: nextRole }) =>
      apiClient.patch(`/members/${id}/role`, { role: nextRole }),
    onSuccess: () => {
      setActionError("");
      invalidate();
    },
    onError: (err) =>
      setActionError(err?.response?.data?.message || "Could not change role."),
  });

  const remove = useMutation({
    mutationFn: (id) => apiClient.delete(`/members/${id}`),
    onSuccess: () => {
      setActionError("");
      invalidate();
    },
    onError: (err) =>
      setActionError(err?.response?.data?.message || "Could not remove member."),
  });

  if (membersQuery.isLoading || invitationsQuery.isLoading) {
    return <div className="p-8">Loading members...</div>;
  }
  if (membersQuery.isError) {
    return <div className="p-8 text-red-600">Failed to load members.</div>;
  }

  const { org, members } = membersQuery.data;
  const invitations = invitationsQuery.data?.invitations || [];

  const selfId = backendUser?.id || backendUser?._id;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Members</h1>
        <LogoutButton />
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {actionError}
        </p>
      )}

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Invite a member</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className={labelClass} htmlFor="inviteEmail">Email</label>
            <input
              id="inviteEmail"
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="coworker@company.com"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="inviteRole">Role</label>
            <select
              id="inviteRole"
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="org_member">Member</option>
              <option value="org_admin">Admin</option>
            </select>
          </div>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => invite.mutate()}
            disabled={!email.trim() || invite.isPending}
          >
            {invite.isPending ? "Sending..." : "Send invitation"}
          </button>
        </div>
        {lastInvite && (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm text-emerald-900 mb-1">
              Invitation sent to {lastInvite.email} as {lastInvite.role}. Share the link below:
            </p>
            <a
              href={lastInvite.url}
              className="text-xs text-indigo-600 break-all hover:underline"
            >
              {lastInvite.url}
            </a>
            <p className="text-xs text-emerald-700 mt-1">
              Expires {new Date(lastInvite.expiresAt).toLocaleDateString()}.
            </p>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-3">
          Capacity: {org.memberCount}/{org.maxMembers} members.
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">
          Current members ({members.length})
        </h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {members.map((m) => {
            const isSelf = m.id === selfId;
            return (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-medium text-slate-900">
                    {m.name}
                    {isSelf && <span className="ml-1 text-xs text-slate-400">(you)</span>}
                  </div>
                  <div className="text-slate-500">{m.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleBadge(m.role)}`}>
                    {m.role}
                  </span>
                  <select
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
                    value={m.role}
                    disabled={isSelf || changeRole.isPending}
                    onChange={(e) => changeRole.mutate({ id: m.id, role: e.target.value })}
                  >
                    <option value="org_member">Member</option>
                    <option value="org_admin">Admin</option>
                  </select>
                  <button
                    type="button"
                    className={btnSecondary}
                    disabled={isSelf || remove.isPending}
                    onClick={() => remove.mutate(m.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-slate-400 mt-2">
          You cannot change your own role or remove yourself. An organization keeps at least one
          admin.
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">
          Pending invitations ({invitations.length})
        </h2>
        {invitations.length === 0 ? (
          <p className="text-sm text-slate-500">No pending invitations.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {invitations.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-2">
                <div>
                  <div className="text-slate-900 font-medium">{inv.email}</div>
                  <div className="text-slate-500">
                    {inv.role} • expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={revoke.isPending}
                  onClick={() => revoke.mutate(inv.id)}
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Members;