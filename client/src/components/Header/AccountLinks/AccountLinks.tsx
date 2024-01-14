import { Link } from 'react-router-dom';

const AccountLinks = ({ isMenuOpen, isLogin, role, handleLogout }) => {
  if (isLogin) {
    return (
      <div className={`${isMenuOpen ? 'gap-4 md:gap-2' : 'gap-2'} flex items-center min-w-fit`}>
        {role.includes('admin') ? (
          <Link
            to='/admin/dashboard'
            className={`${isMenuOpen
              ? 'hover:text-secondary md:scale-100 scale-110 hover:bg-primary border-secondary bg-secondary'
              : 'text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary'
              } header__account-btn`}
          >
            管理員後台
          </Link>
        ) : (
          <Link
            to='/user'
            className={`${isMenuOpen
              ? 'hover:text-secondary hover:bg-primary border-secondary bg-secondary'
              : 'text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary'
              } header__account-btn`}
          >
            會員資料
          </Link>
        )}
        <button className='flex items-center min-w-fit gap-1 md:gap-0.5' onClick={handleLogout}>
          <img
            width='22'
            height='22'
            src={`https://img.icons8.com/windows/32/${isMenuOpen ? 'ffffff' : ''}/exit.png`}
            alt='exit'
          />
          <span className={`${isMenuOpen ? 'text-secondary' : ''} text-sm md:text-xs hover:underline`}>登出</span>
        </button>
      </div>
    );
  } else {
    return (
      <div className={`${isMenuOpen ? 'md:gap-1.5 gap-6' : 'gap-1.5'} flex min-w-fit items-center`}>
        <Link
          to='/account/login'
          className={`${isMenuOpen
            ? 'hover:text-secondary md:scale-100 scale-125 hover:bg-primary border-secondary bg-secondary'
            : 'text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary'
            } header__account-btn`}
        >
          登入
        </Link>
        <Link
          to='/account/register'
          className={`${isMenuOpen
            ? 'hover:text-secondary md:scale-100 scale-125 hover:bg-primary border-secondary bg-secondary'
            : 'text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary'
            } header__account-btn`}
        >
          會員註冊
        </Link>
      </div>
    );
  }
};

export default AccountLinks;