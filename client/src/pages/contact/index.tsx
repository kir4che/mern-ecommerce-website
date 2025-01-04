import { useState } from "react";
import Layout from "@/layouts/AppLayout";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <Layout className="flex flex-col items-center justify-center w-full max-w-lg px-5 mx-auto md:px-8">
      <h2 className="mb-10 text-2xl text-center">聯繫我們</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="姓名"
            required
            className="flex-1"
          />
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="電子郵件"
            required
            className="flex-1"
          />
        </div>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={4}
          placeholder="內容"
          required
          className="w-full textarea textarea-bordered"
        />
        <Button type="submit" className="block w-40 mx-auto rounded-none">
          傳送
        </Button>
      </form>
    </Layout>
  );
};

export default Contact;
