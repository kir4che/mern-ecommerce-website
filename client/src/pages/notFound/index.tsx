import { useNavigate } from "react-router-dom";

import Layout from "@/layouts/AppLayout";
import Alert from "@/components/atoms/Alert";
import Button from "@/components/atoms/Button";

const DEFAULT_ERROR_MESSAGE = "找不到頁面";
const GENERAL_ERROR_MESSAGE = "頁面發生錯誤";

interface NotFoundProps {
  message?: string | string[];
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <Layout className="relative flex flex-col items-center justify-center">
      {message && (
        <Alert
          type="error"
          message={message}
          className="absolute w-fit top-6"
        />
      )}
      <h2 className="text-4xl">404</h2>
      <p className="mt-4 mb-10 text-2xl">
      {message ? GENERAL_ERROR_MESSAGE : DEFAULT_ERROR_MESSAGE}
      </p>
      <Button onClick={() => navigate("/")} className="px-8">
        返回首頁
      </Button>
    </Layout>
  );
};

export default NotFound;
