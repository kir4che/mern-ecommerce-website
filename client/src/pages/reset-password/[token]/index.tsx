import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { validatePassword } from "@/utils/validation";

import Layout from "@/layouts/AppLayout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Alert from "@/components/atoms/Alert";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formError.password || formError.confirmPassword) return;
    setError("");
    setSuccess("");

    try {
      const res = await axios.new(
        `${process.env.REACT_APP_API_URL}/user/update-password`,
        { resetToken: token, password },
        { headers: { "Content-Type": "application/json" } },
      );

      if (res.status === 200) {
        setSuccess("密碼重設成功，將跳轉至登入頁面。");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("連結無效或已過期，請重新申請重設密碼。");
      } else setError("發生錯誤，請稍後再試。");
    }
  };

  return (
    <Layout className="relative flex flex-col justify-center w-full max-w-sm px-4 mx-auto">
      <h2 className="mb-8 -mt-20 text-xl text-center sm:-mt-36">重設密碼</h2>
      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <Input
          value={password}
          label="新密碼"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
            setFormError((prev) => ({
              ...prev,
              password: validatePassword(e.target.value),
            }));
          }}
          error={password && formError.password}
          required
        />
        <Input
          value={confirmPassword}
          label="再次輸入密碼"
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFormError((prev) => ({
              ...prev,
              confirmPassword: password !== e.target.value && "密碼輸入不一致",
            }));
          }}
          error={confirmPassword && formError.confirmPassword}
          required
        />
        <Button type="submit" className="mt-4 rounded-none">
          重設密碼
        </Button>
      </form>
      {success && (
        <Alert
          type="success"
          message={success}
          className="absolute -translate-x-1/2 left-1/2 w-fit top-4 text-nowrap"
        />
      )}
      {error && (
        <Alert
          type="error"
          message={error}
          className="absolute -translate-x-1/2 left-1/2 w-fit top-4 text-nowrap"
        />
      )}
    </Layout>
  );
};

export default ResetPassword;
