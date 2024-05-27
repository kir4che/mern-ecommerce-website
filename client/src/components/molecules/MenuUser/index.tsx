import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useCart } from '@/hooks/useCart';
import LinkBtn from '@/components/atoms/LinkBtn';
import IconBtn from '@/components/atoms/IconBtn';

const MenuUser = ({ isMenuOpen }) => {
  const navigate = useNavigate();

  const { setCart, setTotalQuantity } = useCart();

  const isLogin = Cookies.get('isLogin');
  const role = Cookies.get('role');

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/user/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (res.ok) {
        setCart([])
        setTotalQuantity(0)

        Cookies.remove('token')
        Cookies.remove('isLogin')
        Cookies.remove('role')

        navigate('/')
      } else alert('登出失敗，請稍後再試！')
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    isLogin ? (
      <div className={`${isMenuOpen ? 'gap-4 md:gap-2' : 'gap-2'} flex items-center min-w-fit`}>
        {role.includes('admin') ? (
          <LinkBtn to='/admin/dashboard' isInMenu={isMenuOpen} className='scale-110 md:scale-100' text='管理員後台' />
        ) : (
          <LinkBtn to='/user' isInMenu={isMenuOpen} text='會員資料' />
        )}
        <IconBtn onClick={handleLogout} icon={<img
          src={`https://img.icons8.com/windows/32/${isMenuOpen ? 'ffffff' : ''}/exit.png`}
          alt='exit-icon'
          width='22'
          height='22'
          loading="lazy"
        />} isInMenu={isMenuOpen} text='登出' />
      </div>
    ) : (
      <div className={`${isMenuOpen ? 'md:gap-1.5 gap-4' : 'gap-4'} flex min-w-fit items-center`}>
        <LinkBtn to='/account/login' isInMenu={isMenuOpen} className='scale-125 md:scale-100' text='登入' />
        <LinkBtn to='/account/register' isInMenu={isMenuOpen} className='scale-125 md:scale-100' text='會員註冊' />
      </div>
    ))
}

export default MenuUser;