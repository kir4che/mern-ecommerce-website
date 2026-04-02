import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useResetPasswordMutation } from "@/store/slices/apiSlice";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import MailIcon from "@/assets/icons/mail.inline.svg?react";

const schema = z.object({
  email: z.email({ message: "請輸入有效的 Email 格式" }),
});

type ResetPasswordFormData = z.infer<typeof schema>;

const RequestResetLink = () => {
  const { showAlert } = useAlert();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [countdown, setCountdown] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async ({ email }: ResetPasswordFormData) => {
    try {
      await resetPassword({ email }).unwrap();
    } catch (err: unknown) {
      console.debug("Reset password failed or email not found", err);
    } finally {
      showAlert({
        variant: "success",
        message: "若該 Email 存在，重設密碼連結已發送至您的信箱。",
      });
      setCountdown(60);
    }
  };

  const isBtnDisabled = isLoading || isSubmitting || countdown > 0;

  return (
    <div className="w-full px-5 m-auto md:px-8 space-y-4">
      <h2 className="text-center">忘記密碼</h2>
      <p className="text-sm text-gray-600 text-center">
        請輸入您註冊時使用的 Email，我們將發送重設密碼的連結給您。
      </p>
      <form
        className="flex flex-col gap-8 max-w-72 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          {...register("email")}
          type="email"
          placeholder="請輸入您的 Email"
          icon={MailIcon}
          error={errors.email?.message ?? ""}
        />
        <Button
          type="submit"
          disabled={isBtnDisabled}
          aria-disabled={isBtnDisabled}
          className="py-2.5"
        >
          {countdown > 0
            ? `請等待 ${countdown} 秒後重試`
            : isLoading || isSubmitting
              ? "發送中"
              : "發送重設連結"}
        </Button>
      </form>
    </div>
  );
};

export default RequestResetLink;
