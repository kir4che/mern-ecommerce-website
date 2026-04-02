import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

import Loading from "@/components/atoms/Loading";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role !== "admin")
      showAlert({ variant: "error", message: "您沒有權限進入管理員後台。" });
  }, [isLoading, isAuthenticated, user, showAlert]);

  if (isLoading) return <Loading />;

  if (!isAuthenticated || !user)
    return <Navigate to="/login" replace state={{ from: location }} />;

  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminRoute;
