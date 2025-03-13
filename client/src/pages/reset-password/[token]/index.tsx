import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAlert } from "@/context/AlertContext";
import { useAxios } from "@/hooks/useAxios";

import Layout from "@/layouts/AppLayout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { showAlert } = useAlert();

  const { refresh: ResetPassword } = useAxios(
    "/user/update-password",
    { method: "POST", withCredentials: true },
    {
      immediate: false,
      onSuccess: () => {
        showAlert({
          variant: "success",
          message: "密碼重設成功，將跳轉至登入頁面。",
        });
        setTimeout(() => navigate("/login"), 3000);
      },
      onError: (err) => {
        if (err.statusCode === 400) {
          showAlert({
            variant: "error",
            message: "連結無效或已過期，請重新申請重設密碼。",
          });
        } else
          showAlert({
            variant: "error",
            message: "發生錯誤，請稍後再試。",
          });
      },
    },
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSamePassword, setIsSamePassword] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSamePassword) return;
    await ResetPassword({ resetToken: token, password });
  };

  return (
    <Layout className="relative flex flex-col justify-center w-full max-w-sm px-4 mx-auto">
      <h2 className="mb-8 -mt-12 text-xl text-center ">重設密碼</h2>
      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <Input
          value={password}
          label="新密碼"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          value={confirmPassword}
          label="再次輸入密碼"
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setIsSamePassword(e.target.value === password);
          }}
          error={confirmPassword && !isSamePassword && "密碼不一致"}
          required
        />
        <Button type="submit" className="mt-4 rounded-none">
          重設密碼
        </Button>
      </form>
    </Layout>
  );
};

export default ResetPassword;
