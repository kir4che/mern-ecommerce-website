import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";

import Input from "@/components/atoms/Input";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";

import MailIcon from "@/assets/icons/mail.inline.svg?react";
import LockIcon from "@/assets/icons/lock.inline.svg?react";

type FromState = { from?: { pathname: string; search?: string } };

const isFromState = (v: unknown): v is FromState => {
  if (typeof v !== "object" || v === null) return false;
  if (!("from" in v)) return true;
  const from = (v as { from?: unknown }).from;
  return typeof from === "object" && from !== null;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, error, login } = useAuth();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(email, password, rememberMe);
  };

  useEffect(() => {
    if (!user) return;

    const fromQuery = searchParams.get("from");
    const fromState = isFromState(location.state)
      ? location.state.from
      : undefined;

    const isSafePath = (p?: string) =>
      typeof p === "string" && p.startsWith("/");
    const stateTarget = fromState?.pathname
      ? `${fromState.pathname}${fromState.search || ""}`
      : undefined;

    const target = isSafePath(fromQuery)
      ? fromQuery
      : isSafePath(stateTarget)
        ? stateTarget
        : "/";

    navigate(target!, { replace: true });
  }, [user, navigate, searchParams, location.state]);

  useEffect(() => {
    if (!error) return;
    showAlert({
      variant: "error",
      message: error,
    });
  }, [error, showAlert]);

  return (
    <div className="w-full max-w-sm px-5 mx-auto md:px-8">
      <h2 className="mb-8 -mt-12 text-2xl text-center">登入會員</h2>
      <form className="flex flex-col gap-4 md:text-sm" onSubmit={handleLogin}>
        <Input
          value={email}
          type="email"
          placeholder="Email"
          icon={MailIcon}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <Input
          value={password}
          type="password"
          placeholder="密碼"
          icon={LockIcon}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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
        <p className="text-center">
          還沒有帳號？
          <Link to="/register" className="text-center hover:underline">
            立即註冊
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
