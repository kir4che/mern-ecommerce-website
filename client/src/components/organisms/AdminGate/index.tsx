import { ReactNode, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";

import Loading from "@/components/atoms/Loading";

type Props = { children: ReactNode };

const AdminGate = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

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
      showAlert({
        variant: "error",
        message: "沒有權限進入此頁面！",
        dismissTimeout: 1500,
      });
      const timer = setTimeout(() => navigate("/", { replace: true }), 750);
      return () => clearTimeout(timer as unknown as number);
    }
  }, [isLoading, isAuthenticated, user?.role, navigate, location, showAlert]);

  if (isLoading) return <Loading fullPage />;
  if (!isAuthenticated || user?.role !== "admin") return null;

  return <>{children}</>;
};

export default AdminGate;
