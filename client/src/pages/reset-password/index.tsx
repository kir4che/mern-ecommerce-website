import { useState, useRef, useEffect } from "react";

import { useAlert } from "@/context/AlertContext";
import { useAxios } from "@/hooks/useAxios";

import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

import MailIcon from "@/assets/icons/mail.inline.svg?react";

const RequestResetLink: React.FC = () => {
  const { showAlert } = useAlert();
  const [countdown, setCountdown] = useState<number>(0);
  const [email, setEmail] = useState("");

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const { isLoading, refresh: ResetPassword } = useAxios(
    "/user/reset-password",
    { method: "POST", withCredentials: true },
    {
      immediate: false,
      onSuccess: () => setCountdown(60),
      onError: (err) => {
        if (err.statusCode === 404) {
          showAlert({
            variant: "error",
            message: "該 Email 不存在。",
          });
        } else
          showAlert({
            variant: "error",
            message: "發送連結失敗，請稍後再試。",
          });
      },
    }
  );

  useEffect(() => {
    if (countdown <= 0) return;

    // 啟動計時器，每秒更新一次倒數值。
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 清除計時器，避免記憶體溢出。
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [countdown]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await ResetPassword({ email });
  };

  return (
    <div className="w-full max-w-sm px-5 mx-auto md:px-8">
      <h2 className="mb-8 -mt-12 text-2xl text-center">重設密碼</h2>
      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <Input
          value={email}
          type="email"
          placeholder="請輸入您的 Email"
          icon={MailIcon}
          onChange={(e) => setEmail(e.target.value.trim())}
          pattern={{
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "請輸入有效的 Email 格式",
          }}
          required
        />
        <Button
          type="submit"
          className="mx-auto mt-8 rounded-none w-fit"
          disabled={isLoading || countdown > 0}
          aria-disabled={isLoading || countdown > 0}
        >
          {countdown > 0 ? `${countdown} 秒後可以重新發送` : "發送重設連結"}
        </Button>
      </form>
    </div>
  );
};

export default RequestResetLink;
