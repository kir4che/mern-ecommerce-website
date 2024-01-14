import { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isMenuOpen])

  return (
    <>
      <div className={isMenuOpen ? 'fixed top-0 z-30 flex w-full min-h-screen' : 'sticky top-0 z-50'}>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className={isMenuOpen ? "menu__gallery-reset  " : "menu__gallery-hidden"} />
      </div>
      <main className='min-h-screenwithhf'>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;