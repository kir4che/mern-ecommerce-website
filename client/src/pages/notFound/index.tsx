import { useNavigate } from "react-router";

import Button from "@/components/atoms/Button";

type ErrorType = "not-found" | "network-error" | "server-error";

interface NotFoundProps {
  message?: string | string[];
  type?: ErrorType;
  onRetry?: () => void;
}

const DEFAULT_MESSAGES: Record<ErrorType, string> = {
  "not-found": "抱歉，找不到您要找的頁面。",
  "network-error": "網路連線失敗，請檢查您的網路狀態。",
  "server-error": "伺服器發生錯誤，請稍後再試。",
};

const STATUS_CODES: Record<ErrorType, string> = {
  "not-found": "404",
  "network-error": "ERROR",
  "server-error": "500",
};

const TITLE_MAP: Record<ErrorType, string> = {
  "not-found": "您查找的商品或頁面不存在",
  "network-error": "網路連線問題",
  "server-error": "伺服器出現問題",
};

const NotFound = ({ message, type = "not-found", onRetry }: NotFoundProps) => {
  const navigate = useNavigate();

  const normalizedMessage = Array.isArray(message)
    ? message.filter(Boolean).join("\n")
    : message || DEFAULT_MESSAGES[type];

  const isNetworkError = type === "network-error";
  const isServerError = type === "server-error";

  return (
    <div className="flex-center m-auto flex-col px-5 text-center">
      <div className="relative">
        <h1 className="text-9xl font-black select-none text-gray-200">
          {STATUS_CODES[type]}
        </h1>
        <p className="absolute inset-0 xs:text-nowrap flex-center text-2xl font-medium">
          {TITLE_MAP[type]}
        </p>
      </div>
      <p className="text-gray-500 whitespace-pre-line leading-relaxed">
        {normalizedMessage}
      </p>
      <div className="flex-center gap-3 mt-8 flex-wrap">
        {(isNetworkError || isServerError) && onRetry && (
          <Button onClick={onRetry} className="px-8 py-2.5">
            重新嘗試
          </Button>
        )}
        <Button
          variant={isNetworkError || isServerError ? "outline" : "primary"}
          onClick={() => navigate("/")}
          className="px-8 py-2.5"
        >
          回到首頁
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
