import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";

import { useAlert } from "@/context/AlertContext";

import Button from "@/components/atoms/Button";

const DEFAULT_ERROR_MESSAGE = "找不到頁面";

interface NotFoundProps {
  message?: string | string[];
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const normalizedMessage = useMemo(() => {
    if (Array.isArray(message)) return message.filter(Boolean).join("\n");
    return message ?? "";
  }, [message]);

  useEffect(() => {
    if (normalizedMessage)
      showAlert({
        variant: "error",
        message: normalizedMessage,
      });
  }, [normalizedMessage, showAlert]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
      <h2 className="text-4xl">404</h2>
      <p className="mt-4 mb-10 text-2xl text-center whitespace-pre-line">
        {normalizedMessage || DEFAULT_ERROR_MESSAGE}
      </p>
      <Button onClick={() => navigate("/")} className="px-8">
        返回首頁
      </Button>
    </div>
  );
};

export default NotFound;
