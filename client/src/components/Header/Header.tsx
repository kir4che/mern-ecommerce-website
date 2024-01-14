import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import AccountLinks from './AccountLinks/AccountLinks';
import { useCart } from '../../hooks/useCart';

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  const isLogin = Cookies.get('isLogin');
  const role = Cookies.get('role');

  const { setCart, totalQuantity, setTotalQuantity, isAdded } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className='relative flex-1'>
      <p className={`${isAdded ? 'block' : 'hidden'} absolute z-50 px-4 py-2 text-sm bg-primary/65 text-secondary top-14 right-4 rounded-xl`}>
        已加到購物車
      </p>
      <div className={`${isMenuOpen ? "header-hidden" : "header-reset"} px-5 duration-700 ease-in-out md:px-8`}>
        <div className={`flex items-center duration-700 h-24 ${isScrolled ? 'sm:h-14 xl:h-16' : 'sm:h-20 xl:h-24'}`}>
          <div className='flex items-center gap-2 sm:flex-1'>
            <button className={`p-3 z-50 ${isScrolled ? 'sm:p-1.5 xl:p-2' : 'sm:p-2 lg:p-3 xl:p-3.5'} duration-700 bg-secondary border-2 sm:border-[1.75px] rounded-full border-primary`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <img width="16" height="16" src="https://img.icons8.com/material/30/delete-sign--v1.png" className='min-w-5 sm:min-w-4' alt="close" /> : <img width="20" height="20" src="https://img.icons8.com/ios-glyphs/30/menu--v3.png" className='w-6 sm:w-4 xl:w-5' alt="menu" />}
            </button>
            <p className='hidden text-xs xl:text-sm xl:font-medium md:inline'>Menu</p>
          </div>
          <Link to='/' className={`${isMenuOpen ? "header__logo-hidden" : "header__logo-reset"} header__logo`}>
            <img src={logo} alt="logo" className={isScrolled ? 'sm:w-36 xl:w-40' : 'sm:w-40 xl:w-48'} />
          </Link>
          <div className={`${isMenuOpen ? "gap-2 md:flex" : "flex-1 sm:flex"} items-center justify-end hidden`}>
            <AccountLinks isMenuOpen={isMenuOpen} isLogin={isLogin} role={role} handleLogout={handleLogout} />
            <Link to='/cart' className='flex items-center gap-1.5 ml-4 text-xs xl:text-sm min-w-fit'>
              <span className={`${isMenuOpen ? "text-secondary" : ""} xl:font-medium`}>購物車</span>
              <span className={`${isMenuOpen ? "bg-secondary" : 'bg-primary text-secondary'} rounded-full w-6 inline-flex items-center justify-center h-6`}>{totalQuantity}</span>
            </Link>
          </div>
        </div>
        <div className='w-full border-t border-primary' />
      </div >
      <div className={isMenuOpen ? 'menu__bg-reset' : 'menu__bg-hidden'} >
        <section className={isMenuOpen ? 'menu__list' : 'hidden'}>
          <ul>
            <li><Link to='/' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>首頁</Link></li>
            <li><Link to='/pages/about' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>關於我們</Link></li>
            <li><Link to='/blogs/news' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>最新消息</Link></li>
            <li><Link to='/pages/faq' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>常見問題</Link></li>
            <li><Link to='/pages/contact' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>聯繫我們</Link></li>
          </ul>
          <ul>
            <li><Link to='/collections/all' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>所有商品</Link></li>
            <li><Link to='/collections/recommend' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>推薦</Link></li>
            <li><Link to='/collections/bread' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>麵包</Link></li>
            <li><Link to='/collections/cake' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>蛋糕</Link></li>
            <li><Link to='/collections/cookie' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>餅乾</Link></li>
            <li><Link to='/collections/other' className='menu__item' onClick={() => setIsMenuOpen(!isMenuOpen)}>其他</Link></li>
          </ul>
        </section>
        <section className='flex items-center justify-between md:hidden'>
          <div className='flex gap-2 text-lg font-medium'>
            <AccountLinks isMenuOpen={isMenuOpen} isLogin={isLogin} role={role} handleLogout={handleLogout} />
          </div>
          <button className='space-x-2' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className='text-lg font-medium text-secondary'>購物車</span>
            <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary'>{totalQuantity}</span>
          </button>
        </section>
      </div>
    </header>
  );
}

export default Header;