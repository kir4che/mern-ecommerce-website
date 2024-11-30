import { useState, useRef, useEffect } from "react";
import axios from "axios";

import { validateEmail } from "@/utils/validation";

import Layout from "@/layouts/AppLayout";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Alert from "@/components/atoms/Alert";

import { ReactComponent as MailIcon } from "@/assets/icons/mail.inline.svg";

const RequestResetLink: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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
    if (!email || emailError) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.new(
        `${process.env.REACT_APP_API_URL}/user/reset-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.status === 200) setCountdown(60); // 開始倒數
    } catch (error) {
      if (error.response?.status === 404) {
        setError("該 Email 並不存在。");
      } else setError("發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="relative flex flex-col justify-center w-full max-w-xs px-4 mx-auto sm:px-0">
      <h2 className="mb-8 -mt-20 text-xl text-center sm:-mt-36">重設密碼</h2>
      <form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
        <Input
          value={email}
          type="email"
          placeholder="請輸入您的 Email"
          icon={MailIcon}
          onChange={(e) => {
            setEmail(e.target.value.trim());
            setEmailError(validateEmail(e.target.value));
          }}
          error={email && emailError}
          required
        />
        <Button
          type="submit"
          className="mx-auto mt-4 rounded-none"
          disabled={loading || countdown > 0}
          aria-disabled={loading || countdown > 0}
        >
          {countdown > 0 ? `${countdown} 秒後可以重新發送` : "發送重設連結"}
        </Button>
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

export default RequestResetLink;