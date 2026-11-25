import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

const LogoutButton = ({ className = "", compact = false, id = "logout-btn" }) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleLogout}
      title={compact ? "Log out" : undefined}
      aria-label="Log out"
      className={`inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-rose-400 transition-colors duration-200 cursor-pointer ${className}`}
    >
      <LogOut className="w-4 h-4 shrink-0" />
      {!compact && <span>Log out</span>}
    </button>
  );
};

export default LogoutButton;
