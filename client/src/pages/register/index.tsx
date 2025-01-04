import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAxios } from "@/hooks/useAxios";
import { validateEmail, validatePassword } from "@/utils/validation";

import Layout from "@/layouts/AppLayout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Alert from "@/components/atoms/Alert";

import { ReactComponent as MailIcon } from "@/assets/icons/mail.inline.svg";
import { ReactComponent as LockIcon } from "@/assets/icons/lock.inline.svg";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  const { error, isLoading, refresh } = useAxios(
    "/user/register",
    { method: "POST" },
    {
      immediate: false,
      onSuccess: () => navigate("/login"),
    }
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 在提交前重新驗證
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setFormError({
      email: emailError,
      password: passwordError,
    });

    if (!email || !password || emailError || passwordError) {
      return;
    }

    await refresh({
      data: { email, password },
    });
  };

  return (
    <Layout className="relative flex flex-col justify-center w-full max-w-sm px-5 mx-auto md:px-8">
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
          onChange={(e) => {
            setEmail(e.target.value.trim());
            setFormError((prev) => ({
              ...prev,
              email: validateEmail(e.target.value),
            }));
          }}
          error={email && formError.email}
          required
        />
        <Input
          value={password}
          type="password"
          placeholder="密碼"
          icon={LockIcon}
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
        <Button type="submit" className="mx-auto mt-8 rounded-none w-28" disabled={isLoading}>
          註冊
        </Button>
        <p className="text-sm text-center">
          已經有帳號了？
          <Link to="/login" className="hover:underline">
            點此登入
          </Link>
        </p>
      </form>
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

export default Register;
