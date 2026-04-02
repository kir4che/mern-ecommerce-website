import Loading from "@/components/atoms/Loading";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Loading />;

  if (!isAuthenticated || !user?.email)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return <>{children}</>;
};

export default PrivateRoute;
