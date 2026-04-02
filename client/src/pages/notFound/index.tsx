import { useMemo } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/atoms/Button";

interface NotFoundProps {
  message?: string | string[];
}

const NotFound = ({ message }: NotFoundProps) => {
  const navigate = useNavigate();

  const normalizedMessage = useMemo(() => {
    if (Array.isArray(message)) return message.filter(Boolean).join("\n");
    return message || "抱歉，找不到您要找的頁面";
  }, [message]);

  return (
    <div className="flex-center m-auto flex-col px-5 text-center">
      <div className="relative">
        <h1 className="text-9xl font-black text-gray-100 select-none">404</h1>
        <p className="absolute inset-0 xs:text-nowrap flex-center text-2xl font-medium">
          您查找的商品或頁面不存在
        </p>
      </div>
      <p className="text-gray-500 mt-2 whitespace-pre-line leading-relaxed">
        {normalizedMessage}
      </p>
      <Button
        variant="primary"
        onClick={() => navigate("/")}
        className="px-8 py-2.5 mt-8"
      >
        回到首頁
      </Button>
    </div>
  );
};

export default NotFound;
