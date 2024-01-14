import { useState } from 'react';
import Layout from '../../components/Layout/Layout';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    telephone: '',
    content: ''
  });

  return (
    <Layout>
      <section className="px-[5vw] pt-8 pb-10 md:pb-16 w-full max-w-[812px] mx-auto">
        <h1 className="text-5xl font-normal">
          聯繫我們
        </h1>
      </section>
      <form className="px-[5vw] space-y-4 md:space-y-6 w-full md:w-fit mx-auto">
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <input type="text" name="name" value={form.name} className="py-2.5 pl-4 w-full md:w-80 text-sm border placeholder-primary border-primary" placeholder="姓名" />
          <input type="email" name="email" value={form.email} className="py-2.5 pl-4 w-full md:w-80 text-sm border placeholder-primary border-primary" placeholder="電子郵件" />
        </div>
        <input type="tel" name="telephone" pattern="[0-9\-]*" value={form.telephone} className='py-2.5 pl-4 w-full text-sm border placeholder-primary border-primary' placeholder="電話號碼" />
        <textarea name="content" value={form.content} rows={4} className='py-2.5 pl-4 w-full text-sm border placeholder-primary border-primary' placeholder="內容" />
        <button type="submit" className="px-8 py-3 md:text-sm text-secondary bg-primary">
          傳送
        </button>
      </form>
    </Layout>
  )
}

export default Contact;