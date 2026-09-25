import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { btnPrimary, btnSecondary, cardClass, formatPrice } from "../../utils/ui";
import StatusBadge from "../../components/StatusBadge";

const roleStyle = (role) =>
  role === "org_admin"
    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";

const OrganizationDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const orgQuery = useQuery({
    queryKey: ["admin", "organizations", id],
    queryFn: () => apiClient.get(`/admin/organizations/${id}`).then((r) => r.data),
  });

  const toggleStatus = useMutation({
    mutationFn: (nextStatus) =>
      apiClient.patch(`/admin/organizations/${id}/status`, { status: nextStatus }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] }),
  });

  if (orgQuery.isLoading)
    return <div className="p-8 text-slate-300">Loading organization...</div>;
  if (orgQuery.isError)
    return <div className="p-8 text-rose-400">Failed to load organization.</div>;

  const { organization: org, subscription, members, recentPayments } = orgQuery.data;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{org.name}</h1>
            <StatusBadge status={org.status} />
          </div>
          <p className="text-sm text-slate-400 mt-1">{org.contactEmail}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/organizations" className={btnSecondary}>
            ← Back
          </Link>
          {org.status !== "CANCELLED" && (
            <button
              type="button"
              className={
                org.status === "SUSPENDED"
                  ? btnPrimary
                  : `${btnSecondary} !text-rose-400 !border-rose-500/30 hover:!border-rose-500/60`
              }
              disabled={toggleStatus.isPending}
              onClick={() =>
                toggleStatus.mutate(org.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED")
              }
            >
              {org.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
            </button>
          )}
        </div>
      </div>

      {toggleStatus.isError && (
        <p role="alert" className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6">
          {toggleStatus.error?.response?.data?.message || "Could not change organization status."}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className={cardClass}>
          <h2 className="text-base font-semibold text-white mb-4">Profile</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-slate-400 text-xs">Plan</dt>
              <dd className="text-white font-medium mt-0.5">{org.plan?.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs">Contact</dt>
              <dd className="text-white font-medium mt-0.5">{org.contactName}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs">Signup</dt>
              <dd className="text-white font-medium mt-0.5">{new Date(org.signupDate).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs">Activated</dt>
              <dd className="text-white font-medium mt-0.5">
                {org.activatedAt ? new Date(org.activatedAt).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs">Stripe customer</dt>
              <dd className="text-white font-mono text-xs mt-0.5 truncate">{org.stripeCustomerId || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs">Stripe subscription</dt>
              <dd className="text-white font-mono text-xs mt-0.5 truncate">{org.stripeSubscriptionId || "—"}</dd>
            </div>
          </dl>
          {org.suspendedAt && (
            <p className="text-xs text-rose-400 mt-4 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
              Suspended since {new Date(org.suspendedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className={cardClass}>
          <h2 className="text-base font-semibold text-white mb-4">Subscription</h2>
          {subscription ? (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-slate-400 text-xs">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={subscription.status} />
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 text-xs">Period</dt>
                <dd className="text-white font-medium mt-0.5">
                  {subscription.currentPeriodStart
                    ? `${new Date(subscription.currentPeriodStart).toLocaleDateString()} → ${new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString()}`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 text-xs">Trial ends</dt>
                <dd className="text-white font-medium mt-0.5">
                  {subscription.trialEnd ? new Date(subscription.trialEnd).toLocaleDateString() : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400 text-xs">Cancels at</dt>
                <dd className="text-white font-medium mt-0.5">
                  {subscription.canceledAt ? new Date(subscription.canceledAt).toLocaleDateString() : "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-400">No subscription on file.</p>
          )}
        </div>
      </div>

      <div className={`${cardClass} mb-4`}>
        <h2 className="text-base font-semibold text-white mb-4">Members ({members?.length || 0})</h2>
        <ul className="divide-y divide-white/10 text-sm">
          {members?.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2.5">
              <div>
                <div className="text-white font-semibold">{m.name}</div>
                <div className="text-slate-400 text-xs">{m.email}</div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyle(m.role)}`}>
                {m.role}
              </span>
            </li>
          ))}
          {members?.length === 0 && <li className="py-2 text-slate-400">No members.</li>}
        </ul>
      </div>

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-white mb-4">Recent payments</h2>
        {recentPayments?.length === 0 ? (
          <p className="text-sm text-slate-400">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {recentPayments?.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-white font-medium">{p.invoiceNumber || "Invoice"}</div>
                  <div className="text-slate-400 text-xs">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}
                  </div>
                </div>
                <div className="text-white font-bold">
                  {formatPrice(p.amountCents, p.currency)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetail;