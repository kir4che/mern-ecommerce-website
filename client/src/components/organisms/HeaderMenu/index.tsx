import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/utils/cn";

import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import Navigation from "@/components/molecules/Navigation";

import CartIcon from "@/assets/icons/cart.inline.svg?react";
import DashboardIcon from "@/assets/icons/dashboard.inline.svg?react";
import MenuIcon from "@/assets/icons/menu.inline.svg?react";
import UserIcon from "@/assets/icons/user-circle.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";
import shop5 from "@/assets/images/about/shop5.jpg";

const HeaderMenu = () => {
  const { user } = useAuth();
  const { totalQuantity } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {!isMenuOpen && <div className="w-full h-20 shrink-0" />}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all",
          isMenuOpen
            ? "bg-slate-900 h-screen overflow-hidden duration-700 ease-out"
            : "bg-white duration-150 ease-in",
          isScrolled && !isMenuOpen
            ? "border-b border-primary shadow-sm"
            : "border-transparent"
        )}
      >
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 max-md:hidden md:w-1/2 lg:w-7/12 bg-slate-800 z-0 overflow-hidden transition-all",
            isMenuOpen
              ? "translate-x-0 opacity-100 duration-700 ease-out"
              : "translate-x-full opacity-0 duration-300 ease-in"
          )}
        >
          <img
            src={shop5}
            alt="日出麵包坊"
            className="size-full object-cover object-center opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-1000"
          />
        </div>
        <div className="relative z-10 size-full flex flex-col">
          <header
            className={cn(
              "flex-between px-4 md:px-8 relative transition-all",
              isScrolled && !isMenuOpen ? "h-16" : "h-20",
              isMenuOpen
                ? "w-full md:w-1/2 lg:w-5/12 duration-700 ease-out"
                : "w-full duration-300 ease-in"
            )}
          >
            <Button
              variant="outline"
              icon={isMenuOpen ? CloseIcon : MenuIcon}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              iconStyle={cn(
                "transition-colors",
                isMenuOpen ? "stroke-white duration-700" : "duration-150"
              )}
              aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
              className={cn(
                "rounded-full size-9",
                isMenuOpen ? "border-white" : ""
              )}
            />
            <Link
              to="/"
              className={cn(
                "absolute -translate-x-1/2 left-1/2 transition-all",
                isMenuOpen
                  ? "opacity-0 pointer-events-none scale-95 duration-300"
                  : "opacity-100 scale-100 duration-500 delay-150"
              )}
              aria-label="回首頁"
            >
              <Logo isWhite={false} />
            </Link>
            <div className="flex items-center gap-3 mr-3 md:gap-4">
              {user ? (
                <>
                  <Link
                    to="/my-account"
                    className="hidden sm:block"
                    aria-label="前往會員中心"
                  >
                    <UserIcon
                      className={cn(
                        "size-6 transition-colors",
                        isMenuOpen
                          ? "text-white duration-700"
                          : "text-primary duration-150"
                      )}
                    />
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="hidden sm:block"
                      aria-label="前往管理後台"
                    >
                      <DashboardIcon
                        className={cn(
                          "size-6 transition-colors",
                          isMenuOpen
                            ? "text-white duration-700"
                            : "text-primary duration-150"
                        )}
                      />
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login">
                    <Button
                      variant="icon"
                      className={cn(
                        "transition-colors",
                        isMenuOpen
                          ? "text-white hover:text-gray-300 duration-700"
                          : "text-primary duration-150"
                      )}
                    >
                      登入
                    </Button>
                  </Link>
                  <Link to="/register" className="max-md:hidden">
                    <Button
                      variant={isMenuOpen ? "icon" : "primary"}
                      className={cn(
                        "transition-colors",
                        isMenuOpen
                          ? "text-white hover:text-gray-300 duration-700"
                          : "text-white duration-150"
                      )}
                    >
                      註冊
                    </Button>
                  </Link>
                </div>
              )}
              <Link
                to="/cart"
                className="relative"
                aria-label={`購物車目前有 ${totalQuantity} 件商品`}
              >
                <CartIcon
                  className={cn(
                    "size-6 transition-colors",
                    isMenuOpen
                      ? "stroke-white duration-700"
                      : "stroke-primary duration-150"
                  )}
                />
                {totalQuantity > 0 && (
                  <span
                    className={cn(
                      "absolute -top-2.5 -right-3 rounded-full size-5 text-[10px] font-bold inline-flex items-center justify-center transition-colors",
                      isMenuOpen
                        ? "bg-white text-primary duration-500"
                        : "bg-primary text-white duration-50"
                    )}
                  >
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </header>
          {isMenuOpen && (
            <div className="w-full md:w-1/2 lg:w-5/12 h-[calc(100vh-80px)] overflow-y-auto animate-fade-in">
              <Navigation
                role={user?.role}
                handleMenuClose={() => setIsMenuOpen(false)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
