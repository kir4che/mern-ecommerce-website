import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

import Logo from "@/components/atoms/Logo";
import Button from "@/components/atoms/Button";
import Navigation from "@/components/molecules/Navigation";

import MenuIcon from "@/assets/icons/menu.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";
import UserIcon from "@/assets/icons/user-circle.inline.svg?react";
import CartIcon from "@/assets/icons/cart.inline.svg?react";
import DashboardIcon from "@/assets/icons/dashboard.inline.svg?react";

interface HeaderMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const { user } = useAuth();
  const { totalQuantity } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  // 滾動時變更 Header 樣式
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    } as AddEventListenerOptions);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // 開啟選單時禁止滾動
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div
      className={
        isMenuOpen
          ? "flex-1 bg-primary duration-700"
          : "bg-secondary overflow-hidden"
      }
    >
      <header
        role="banner"
        className={`flex px-4 md:px-8 w-full items-center justify-between ${
          !isMenuOpen && isScrolled
            ? "fixed top-0 left-0 right-0 z-50 h-16 border-b bg-secondary border-b-primary duration-300"
            : "relative h-20 md:h-24"
        }`}
      >
        <Button
          icon={isMenuOpen ? CloseIcon : MenuIcon}
          className={`h-fit p-2 border-[1.5px] focus:outline-none ${
            isMenuOpen
              ? "hover:bg-primary border-secondary hover:border-secondary"
              : "hover:bg-secondary"
          }`}
          aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          iconStyle={isMenuOpen ? "stroke-secondary" : ""}
        />
        {!isMenuOpen && (
          <Link to="/" className="absolute -translate-x-1/2 left-1/2">
            <Logo isWhite={isMenuOpen} />
          </Link>
        )}
        <div className="flex items-center gap-3 mr-3 md:gap-4">
          {user ? (
            <>
              <Link to="/my-account" className="hidden sm:block">
                <UserIcon className="w-6 h-6" aria-label="會員中心" />
              </Link>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="hidden sm:block">
                  <DashboardIcon className="w-6 h-6" aria-label="管理後台" />
                </Link>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="link"
                  className={isMenuOpen ? "text-secondary" : "text-primary"}
                >
                  登入
                </Button>
              </Link>
              <Link to="/register" className="hidden md:block">
                <Button
                  variant={isMenuOpen ? "secondary" : "primary"}
                  className="h-9"
                >
                  註冊
                </Button>
              </Link>
            </div>
          )}
          <Link to="/cart" className="relative">
            <CartIcon
              className={`w-6 h-6 transition-colors duration-300 ${isMenuOpen ? "stroke-secondary" : "stroke-primary"}`}
              aria-label="購物車"
            />
            <span
              className={`absolute -top-3 -right-4 rounded-full w-[22px] h-[22px] inline-flex text-xs items-center justify-center ${
                isMenuOpen ? "bg-secondary" : "bg-primary text-secondary"
              }`}
              aria-label="購物車數量"
            >
              {totalQuantity}
            </span>
          </Link>
        </div>
      </header>
      <hr className={`border-primary ${isScrolled ? "-mx-8" : ""}`} />
      {/* 網站選單 */}
      {isMenuOpen && (
        <div className="h-screen overflow-y-auto">
          <Navigation
            role={user?.role}
            handleMenuClose={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
