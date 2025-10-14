import { useState } from "react";

import { useAlert } from "@/context/AlertContext";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const Contact = () => {
  const { showAlert } = useAlert();
  const [form, setForm] = useState({
    name: "",
    email: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 尚未實作寄發 Email 功能
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    showAlert({
      variant: "success",
      message: "訊息已送出，我們會盡快回覆您。",
      top: "top-28",
    });

    setForm({
      name: "",
      email: "",
      content: "",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg px-5 mx-auto md:px-8">
      <h2 className="mb-10 text-2xl text-center">聯繫我們</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="姓名"
            wrapperStyle="flex-1"
            required
          />
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="電子郵件"
            pattern={{
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "請輸入有效的 Email 格式",
            }}
            wrapperStyle="flex-1"
            required
          />
        </div>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={4}
          placeholder="內容"
          className="w-full textarea textarea-bordered"
          required
        />
        <Button type="submit" className="block w-40 mx-auto rounded-none">
          傳送
        </Button>
      </form>
    </div>
  );
};

export default Contact;
