import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

interface PrivateRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !user.email)) logout();
  }, [user, loading, logout]);

  if (!user || !user.email) return <Navigate to="/login" replace />;

  return <Component />;
};

export default PrivateRoute;
