import { ReactNode, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";

import Loading from "@/components/atoms/Loading";

type Props = { children: ReactNode };

const AdminGate = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  const navigatedRef = useRef(false);

  useEffect(() => {
    if (isLoading || navigatedRef.current) return;

    if (!isAuthenticated) {
      navigatedRef.current = true;
      navigate("/login", { replace: true, state: { from: location } });
      return;
    }

    if (user?.role !== "admin") {
      navigatedRef.current = true;
      navigate("/", { replace: true });
      return;
    }
  }, [isLoading, isAuthenticated, user?.role, navigate, location]);

  if (isLoading) return <Loading fullPage />;
  if (!isAuthenticated || user?.role !== "admin") return null;

  return <>{children}</>;
};

export default AdminGate;
