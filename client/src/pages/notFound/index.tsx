import { useNavigate } from "react-router";

import { useAlert } from "@/context/AlertContext";

import Button from "@/components/atoms/Button";
import { useEffect } from "react";

const DEFAULT_ERROR_MESSAGE = "找不到頁面";
const GENERAL_ERROR_MESSAGE = "頁面發生錯誤";

interface NotFoundProps {
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (message)
      showAlert({
        variant: "error",
        message: message,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
      <h2 className="text-4xl">404</h2>
      <p className="mt-4 mb-10 text-2xl">
        {message ? GENERAL_ERROR_MESSAGE : DEFAULT_ERROR_MESSAGE}
      </p>
      <Button onClick={() => navigate("/")} className="px-8">
        返回首頁
      </Button>
    </div>
  );
};

export default NotFound;
