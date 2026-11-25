import { statusStyle } from "../utils/ui";

const StatusBadge = ({ status }) => (
  <span
    className={`badge font-mono ${statusStyle[status] || "bg-slate-500/15 text-slate-400 border border-slate-500/30"}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </span>
);

export default StatusBadge;
