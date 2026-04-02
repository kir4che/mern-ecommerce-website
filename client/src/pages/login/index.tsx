import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";

import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import Input from "@/components/atoms/Input";

import LockIcon from "@/assets/icons/lock.inline.svg?react";
import MailIcon from "@/assets/icons/mail.inline.svg?react";

const schema = z.object({
  email: z.email({ message: "請輸入有效的 Email 格式" }),
  password: z.string().min(1, { message: "請輸入密碼" }),
});

type LoginFormData = z.infer<typeof schema>;

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
  const { login, isLoading } = useAuth();
  const { showAlert } = useAlert();

  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      await login(email, password, rememberMe);

      // 從 query、location.state 中提取可能的跳轉目標
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
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "登入失敗，請檢查帳號密碼"),
      });
    }
  };

  return (
    <div className="m-auto w-full max-w-sm px-5 md:px-8">
      <h2 className="mb-8 text-center">登入會員</h2>
      <form
        className="flex flex-col gap-4 md:text-sm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          icon={MailIcon}
          error={errors.email?.message ?? ""}
          autoComplete="email"
        />
        <Input
          {...register("password")}
          type="password"
          placeholder="密碼"
          icon={LockIcon}
          error={errors.password?.message ?? ""}
          autoComplete="current-password"
        />
        <div className="flex-between">
          <Checkbox
            id="rememberMe"
            label="記住我"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            to="/reset-password"
            className="text-sm text-primary hover:underline"
          >
            忘記密碼？
          </Link>
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="mx-auto py-2 mt-4 w-28"
        >
          {isLoading || isSubmitting ? "登入中" : "登入"}
        </Button>
        <p className="text-center">
          還沒有帳號？
          <Link to="/register" className="underline-offset-4 link">
            立即註冊
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
