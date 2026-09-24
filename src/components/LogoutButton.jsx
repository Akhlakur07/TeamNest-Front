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
      onClick={handleLogout}
      className={`text-sm font-medium text-slate-600 hover:text-slate-900 ${className}`}
    >
      Log out
    </button>
  );
};

export default LogoutButton;