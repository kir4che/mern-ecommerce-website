import { useNavigate } from "react-router-dom";

import Layout from "@/layouts/AppLayout";
import Alert from "@/components/atoms/Alert";
import Button from "@/components/atoms/Button";

const NotFound = ({ message = [] }) => {
  const navigate = useNavigate();

  return (
    <Layout className="relative flex flex-col items-center justify-center">
      {message.map((msg) => (
        <Alert
          type="error"
          message={msg}
          className="absolute min-w-1/3 top-4"
        />
      ))}
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-6 mb-10 text-xl">
        {message.length ? "頁面發生錯誤" : "找不到頁面"}
      </p>
      <Button onClick={() => navigate("/")}>返回首頁</Button>
    </Layout>
  );
};

export default NotFound;
