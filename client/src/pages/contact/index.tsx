import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { getErrorMessage } from "@/utils/getErrorMessage";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const schema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.email({ message: "請輸入有效的 Email 格式" }),
  subject: z.string().min(1, "請輸入主旨"),
  message: z.string().min(1, "請輸入內容"),
});

type ContactFormData = z.infer<typeof schema>;

const Contact = () => {
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "發送失敗");
      }

      showAlert({
        variant: "success",
        message: "訊息已送出，我們會盡快回覆您。",
        top: "top-28",
      });
      reset();
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "發送訊息失敗，請稍後再試"),
        top: "top-28",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl px-5 mx-auto md:px-8">
      <div className="mb-8 text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-[0.2em]">聯繫我們</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          關於訂單、商品細節或合作提案，歡迎填寫下表，我們將於 24
          小時內由專人與您聯繫。
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 bg-white p-4 sm:p-8 md:p-12 sm:shadow-sm sm:border sm:border-slate-100"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            {...register("name")}
            label="姓名"
            error={errors.name?.message ?? ""}
            disabled={isSubmitting}
          />
          <Input
            {...register("email")}
            label="Email"
            error={errors.email?.message ?? ""}
            disabled={isSubmitting}
          />
        </div>
        <Input
          {...register("subject")}
          label="主旨"
          error={errors.subject?.message ?? ""}
          disabled={isSubmitting}
        />
        <Textarea
          {...register("message")}
          label="訊息內容"
          rows={5}
          disabled={isSubmitting}
          error={errors.message?.message ?? ""}
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full max-w-xs mx-auto block py-4 text-base tracking-widest uppercase"
          >
            {isSubmitting ? "傳送中..." : "傳送訊息"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
