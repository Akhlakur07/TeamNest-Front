import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const RequireRole = ({ roles }) => {
  const { backendUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!backendUser || !roles.includes(backendUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireRole;