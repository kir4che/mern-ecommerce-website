import { useNavigate } from "react-router-dom";

import Layout from "@/layouts/AppLayout";
import Alert from "@/components/atoms/Alert";
import Button from "@/components/atoms/Button";

const NotFound = ({ message = null }) => {
  const navigate = useNavigate();

  return (
    <Layout className="relative flex flex-col items-center justify-center">
      {message.length > 0 &&
        message.map((msg, index) => (
          <Alert
            key={index}
            type="error"
            message={msg}
            className="absolute w-fit top-6"
          />
        ))}
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-4 mb-10 text-2xl">
        {message === null ? "找不到頁面" : "頁面發生錯誤"}
      </p>
      <Button onClick={() => navigate("/")} className="px-8">
        返回首頁
      </Button>
    </Layout>
  );
};

export default NotFound;
