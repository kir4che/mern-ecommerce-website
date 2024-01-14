import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
        }),
      });
      if (res.ok) {
        alert('註冊成功！');
        navigate('/account/login')
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-[12vw]">
        <h1 className='pt-12 pb-10 text-xl text-center md:text-base'>註冊會員</h1>
        <form className='flex flex-col gap-4 md:text-sm'>
          <input type="text" name="firstName" className='border py-2.5 pl-4 w-full border-primary placeholder-primary' value={form.firstName} placeholder="名字" onChange={handleChange} />
          <input type="text" name="lastName" className='border py-2.5 pl-4 w-full border-primary placeholder-primary' value={form.lastName} placeholder="姓氏" onChange={handleChange} />
          <input type="email" name="email" className='border py-2.5 pl-4 w-full border-primary placeholder-primary' value={form.email} placeholder="電子郵件" onChange={handleChange} />
          <input type="password" name="password" className='border border-primary py-2.5 pl-4 w-full placeholder-primary' value={form.password} placeholder="密碼" onChange={handleChange} />
          <button type='submit' className='px-10 mt-4 -mb-2 py-2.5 mx-auto border border-secondary hover:border-primary text-secondary bg-primary w-fit' onClick={handleRegister}>註冊</button>
          <p className='text-sm text-center md:text-xs'>
            已經有帳號了？
            <Link to="/account/login" className='hover:underline'>
              點此登入
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );

}

export default Register;