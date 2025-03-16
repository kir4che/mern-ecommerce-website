import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link } from "react-router";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import Logo from "@/components/atoms/Logo";
import Button from "@/components/atoms/Button";
import Navigation from "@/components/molecules/Navigation";

import { ReactComponent as MenuIcon } from "@/assets/icons/menu.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";
import { ReactComponent as UserIcon } from "@/assets/icons/user-circle.inline.svg";
import { ReactComponent as CartIcon } from "@/assets/icons/cart.inline.svg";
import { ReactComponent as DashboardIcon } from "@/assets/icons/dashboard.inline.svg";

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

    if (document.documentElement.scrollHeight > window.innerHeight)
      window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
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
          ? "flex-1 md:overflow-auto bg-primary duration-700"
          : "bg-secondary"
      }
    >
      <header
        className={`flex px-4 md:px-8 w-full items-center justify-between ${
          !isMenuOpen && isScrolled
            ? "fixed h-16 border bg-secondary border-b-primary duration-300"
            : "relative h-20 md:h-24"
        }`}
      >
        <Button
          icon={isMenuOpen ? CloseIcon : MenuIcon}
          className={`h-fit p-2 border-[1.5px] ${
            isMenuOpen
              ? "hover:bg-primary border-secondary hover:border-secondary"
              : "hover:bg-secondary"
          }`}
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
                <UserIcon className="w-6 h-6" />
              </Link>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="hidden sm:block">
                  <DashboardIcon className="w-6 h-6" />
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
            />
            <span
              className={`absolute -top-3 -right-4 rounded-full w-[22px] h-[22px] inline-flex text-xs items-center justify-center ${
                isMenuOpen ? "bg-secondary" : "bg-primary text-secondary"
              }`}
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
            user={user}
            handleMenuClose={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
