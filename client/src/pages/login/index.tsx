import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import Layout from "@/layouts/AppLayout";
import Input from "@/components/atoms/Input";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import Alert from "@/components/atoms/Alert";

import { ReactComponent as MailIcon } from "@/assets/icons/mail.inline.svg";
import { ReactComponent as LockIcon } from "@/assets/icons/lock.inline.svg";

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password, rememberMe);
    navigate("/");
  };

  return (
    <Layout className="relative flex flex-col justify-center w-full max-w-xs px-4 mx-auto sm:px-0">
      <h2 className="mb-8 -mt-20 text-xl text-center sm:-mt-36">登入會員</h2>
      <form className="flex flex-col gap-4 md:text-sm" onSubmit={handleLogin}>
        <Input
          value={email}
          type="text"
          placeholder="Email"
          icon={MailIcon}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          value={password}
          type="password"
          placeholder="密碼"
          icon={LockIcon}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between">
          <Checkbox
            id="rememberMe"
            label="記住我"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            to="/reset-password"
            className="text-sm text-blue-500 hover:underline"
          >
            忘記密碼？
          </Link>
        </div>
        <Button type="submit" className="mx-auto mt-8 rounded-none w-28">
          登入
        </Button>
        <p className="text-sm text-center md:text-xs">
          還沒有帳號？
          <Link
            to="/register"
            className="text-sm text-center md:text-xs hover:underline"
          >
            立即註冊
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

export default Login;
