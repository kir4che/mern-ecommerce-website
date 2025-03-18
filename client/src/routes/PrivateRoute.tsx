import { useEffect, type ComponentType } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/atoms/Loading";

interface PrivateRouteProps {
  component: ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const location = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!user?.email) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <Loading />;

  if (!isAuthenticated || !user?.email)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return <Component />;
};

export default PrivateRoute;
