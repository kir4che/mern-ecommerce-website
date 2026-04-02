import { Navigate, useLocation } from "react-router";

import Loading from "@/components/atoms/Loading";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loading />;

  if (!isAuthenticated || !user)
    return <Navigate to="/login" replace state={{ from: location }} />;

  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
