import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

const LogoutButton = ({ className = "" }) => {
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
      id="logout-btn"
      onClick={handleLogout}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors duration-200 ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Log out
    </button>
  );
};

export default LogoutButton;