import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
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
    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";

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
    return <div className="p-8 text-slate-300">Loading members...</div>;
  }
  if (membersQuery.isError) {
    return <div className="p-8 text-rose-400">Failed to load members.</div>;
  }

  const { org, members } = membersQuery.data;
  const invitations = invitationsQuery.data?.invitations || [];
  const selfId = backendUser?.id || backendUser?._id;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Members</h2>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6">
          {actionError}
        </p>
      )}

      <div className={`${cardClass} mb-6`}>
        <h2 className="text-base font-semibold text-white mb-4">Invite a member</h2>
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
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
            <p className="text-sm text-emerald-300 mb-1">
              Invitation sent to {lastInvite.email} as {lastInvite.role}. An email with a link was sent; you can also share the link directly:
            </p>
            <a
              href={lastInvite.url}
              className="text-xs text-indigo-300 break-all hover:underline"
            >
              {lastInvite.url}
            </a>
            <p className="text-xs text-emerald-400/80 mt-1">
              Expires {new Date(lastInvite.expiresAt).toLocaleDateString()}.
            </p>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-3">
          Capacity: <span className="text-white font-medium">{org.memberCount}</span>/{org.maxMembers} members.
        </p>
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className="text-base font-semibold text-white mb-4">
          Current members ({members.length})
        </h2>
        <ul className="divide-y divide-white/10 text-sm">
          {members.map((m) => {
            const isSelf = m.id === selfId;
            return (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold text-white">
                    {m.name}
                    {isSelf && <span className="ml-1.5 text-xs text-slate-400">(you)</span>}
                  </div>
                  <div className="text-slate-400 text-xs">{m.email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge(m.role)}`}>
                    {m.role}
                  </span>
                  <select
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                    value={m.role}
                    disabled={isSelf || changeRole.isPending}
                    onChange={(e) => changeRole.mutate({ id: m.id, role: e.target.value })}
                  >
                    <option value="org_member">Member</option>
                    <option value="org_admin">Admin</option>
                  </select>
                  <button
                    type="button"
                    className={`${btnSecondary} text-xs py-1 px-3`}
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
        <p className="text-xs text-slate-400 mt-3">
          You cannot change your own role or remove yourself. An organization keeps at least one admin.
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">
          Pending invitations ({invitations.length})
        </h2>
        {invitations.length === 0 ? (
          <p className="text-sm text-slate-400">No pending invitations.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {invitations.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="text-white font-medium">{inv.email}</div>
                  <div className="text-slate-400 text-xs">
                    {inv.role} • expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  type="button"
                  className={`${btnSecondary} text-xs py-1 px-3`}
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