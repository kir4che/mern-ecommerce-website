import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { cn } from "@/utils/cn";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const schema = z.object({
  name: z.string().min(1, "請輸入姓名"),
  email: z.email({ message: "請輸入有效的 Email 格式" }),
  content: z.string().min(1, "請輸入內容"),
});

type ContactFormData = z.infer<typeof schema>;

const Contact = () => {
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", content: "" },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("送出資料：", data);
    showAlert({
      variant: "success",
      message: "訊息已送出，我們會盡快回覆您。",
      top: "top-28",
    });
    reset();
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
            label="姓名 Name"
            placeholder="您的稱呼"
            error={errors.name?.message ?? ""}
          />
          <Input
            {...register("email")}
            label="電子郵件 Email"
            placeholder="example@mail.com"
            error={errors.email?.message ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            內容 Message
          </label>
          <textarea
            {...register("content")}
            rows={5}
            placeholder="請輸入您想詢問的內容..."
            className={cn(
              "w-full textarea textarea-bordered bg-slate-50 focus:bg-white transition-all, outline-none",
              { "border-red-500": errors.content }
            )}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full max-w-xs mx-auto block py-4 text-base tracking-widest uppercase"
          >
            傳送訊息
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
