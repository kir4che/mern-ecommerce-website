import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { useCart } from '../../../hooks/useCart';

const Login = () => {
  const navigate = useNavigate();
  const { cart, getCart, setTotalQuantity } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 在跨域請求中使用到 Cookie 的時必須設置
      });
      const data = await res.json();

      if (res.ok) {
        getCart();
        setTotalQuantity(cart.reduce((total, cartItem) => total + cartItem.quantity, 0));

        Cookies.set('token', data.token, { expires: 3, secure: true });
        Cookies.set('isLogin', data.isLogin, { expires: 3 });
        Cookies.set('role', JSON.stringify(data.user.role), { expires: 3 });
        navigate('/')
      } else setError(data.message);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-[12vw]">
        <h1 className='pt-12 pb-10 text-xl text-center md:text-base'>登入會員</h1>
        {error !== '' && <div className="flex items-center p-4 mb-4 -mt-6 text-sm text-red-700 rounded-lg bg-red-50" role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <p><span className="font-medium">登入失敗！</span>{error}</p>
        </div>}
        <form className='flex flex-col gap-4 md:text-sm' onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border py-2.5 pl-4 w-full border-primary placeholder-primary'
            placeholder="電子郵件"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-primary py-2.5 pl-4 w-full placeholder-primary'
            placeholder="密碼"
            required
          />
          <button type='submit' className='px-10 mt-4 -mb-2 py-2.5 mx-auto border border-secondary hover:border-primary text-secondary bg-primary w-fit'>登入</button>
          <Link to="/account/register" className='text-sm text-center md:text-xs hover:underline'>建立一個帳戶</Link>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
