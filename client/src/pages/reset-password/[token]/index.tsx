import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useResetPasswordTokenMutation } from "@/store/slices/apiSlice";
import { getErrorStatus } from "@/utils/getErrorMessage";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const schema = z
  .object({
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: "密碼需包含大小寫英文及數字，且至少 8 字元",
      }),
    confirmPassword: z.string().min(1, { message: "請再次輸入密碼" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof schema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { showAlert } = useAlert();
  const [resetPasswordToken, { isLoading }] = useResetPasswordTokenMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ password }: ResetPasswordFormData) => {
    if (!token) {
      showAlert({ variant: "error", message: "無效的重設連結" });
      return;
    }

    try {
      await resetPasswordToken({ token, password }).unwrap();
      showAlert({
        variant: "success",
        message: "密碼重設成功，請使用新密碼登入。",
      });
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      if (getErrorStatus(err) === 400) {
        showAlert({
          variant: "error",
          message: "連結無效或已過期，請重新申請重設密碼。",
        });
      } else showAlert({ variant: "error", message: "發生錯誤，請稍後再試。" });
    }
  };

  const isBtnDisabled = isLoading || isSubmitting;

  return (
    <div className="w-full px-5 m-auto md:px-8 space-y-4">
      <h2 className="mb-8 text-center">設定新密碼</h2>
      <form
        className="flex flex-col gap-4 max-w-72 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          {...register("password")}
          type="password"
          placeholder="請輸入新密碼"
          error={errors.password?.message ?? ""}
          className=""
        />
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="請再次輸入密碼"
          error={errors.confirmPassword?.message ?? ""}
        />
        <Button
          type="submit"
          disabled={isBtnDisabled}
          aria-disabled={isBtnDisabled}
          className="mx-auto mt-6 w-full btn-primary py-2.5"
        >
          {isBtnDisabled ? "處理中" : "確認重設"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
