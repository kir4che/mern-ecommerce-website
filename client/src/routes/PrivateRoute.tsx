import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
}) => {
  const { user, logout } = useAuth();

  if (!user) {
    logout();
    return <Navigate to="/login" />;
  }
  return <Component />;
};

export default PrivateRoute;
