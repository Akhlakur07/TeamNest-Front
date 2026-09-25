import { statusStyle } from "../utils/ui";

const StatusBadge = ({ status }) => (
  <span
    className={`badge ${statusStyle[status] || "bg-slate-500/20 text-slate-400 border border-slate-500/30"}`}
  >
    {status}
  </span>
);

export default StatusBadge;