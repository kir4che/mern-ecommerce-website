import { useEffect } from "react";
import { Navigate } from "react-router";

import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user?.email) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return <Component />;
};

export default PrivateRoute;
