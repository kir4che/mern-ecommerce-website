import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAlert } from "@/context/AlertContext";
import { useAxios } from "@/hooks/useAxios";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

import MailIcon from "@/assets/icons/mail.inline.svg?react";
import LockIcon from "@/assets/icons/lock.inline.svg?react";

const Register = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, refresh } = useAxios(
    "/user/register",
    { method: "POST" },
    {
      immediate: false,
      onSuccess: () => navigate("/login"),
      onError: (err) =>
        showAlert({
          variant: "error",
          message: err.message,
        }),
    },
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    await refresh({ email, password });
  };

  return (
    <div className="w-full max-w-sm px-5 mx-auto md:px-8">
      <h2 className="mb-8 -mt-12 text-2xl text-center">註冊會員</h2>
      <form
        className="flex flex-col gap-4 md:text-sm"
        onSubmit={handleRegister}
      >
        <Input
          value={email}
          type="email"
          placeholder="Email"
          icon={MailIcon}
          onChange={(e) => setEmail(e.target.value.trim())}
          pattern={{
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "請輸入有效的 Email 格式",
          }}
          autoComplete="email"
          required
        />
        <Input
          value={password}
          type="password"
          placeholder="密碼"
          icon={LockIcon}
          onChange={(e) => setPassword(e.target.value)}
          pattern={{
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: "密碼需包含大小寫英文及數字，且至少 8 字元",
          }}
          autoComplete="current-password"
          required
        />
        <Button
          type="submit"
          className="mx-auto mt-8 rounded-none w-28"
          disabled={isLoading}
        >
          註冊
        </Button>
        <p className="text-center">
          已經有帳號了？
          <Link to="/login" className="hover:underline">
            點此登入
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
