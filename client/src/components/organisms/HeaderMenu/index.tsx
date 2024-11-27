import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import Logo from "@/components/atoms/Logo";
import Tooltip from "@/components/atoms/Tooltip";
import Button from "@/components/atoms/Button";
import Navigation from "@/components/molecules/Navigation";

import { ReactComponent as MenuIcon } from "@/assets/icons/menu.inline.svg";
import { ReactComponent as CloseIcon } from "@/assets/icons/xmark.inline.svg";
import { ReactComponent as UserIcon } from "@/assets/icons/user-circle.inline.svg";
import { ReactComponent as CartIcon } from "@/assets/icons/cart.inline.svg";

const HeaderMenu = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user } = useAuth();
  const { totalQuantity, isAdded } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const Icon = isMenuOpen ? CloseIcon : MenuIcon;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`px-4 md:px-8 
        ${
          isMenuOpen
            ? "flex-1 md:overflow-auto bg-primary duration-700"
            : "bg-secondary"
        }
      `}
    >
      <header
        className={`relative flex items-center justify-between ${isScrolled ? "h-16 duration-300" : "h-20 md:h-24"}`}
      >
        <Button
          className={`h-fit p-2 border-[1.5px] ${
            isMenuOpen
              ? "hover:bg-primary border-secondary hover:border-secondary"
              : "hover:bg-secondary"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon className={`w-5 h-5 ${isMenuOpen ? "stroke-secondary" : ""}`} />
        </Button>
        <Link
          to="/"
          className={
            isMenuOpen ? "hidden" : "absolute -translate-x-1/2 left-1/2"
          }
        >
          <Logo isWhite={isMenuOpen} />
        </Link>
        <div className="flex items-center gap-3 mr-3 md:gap-4">
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin/dashboard" : "/my-account"}
              className="hidden md:block"
            >
              <UserIcon className="w-6 h-6" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <UserIcon
                  className={`w-6 h-6 md:hidden ${isMenuOpen ? "stroke-secondary" : "stroke-primary"}`}
                />
                <Button
                  variant="link"
                  className={`hidden md:block ${isMenuOpen ? "text-secondary" : "text-primary"}`}
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
          <Tooltip isActivated={isAdded} text="已加到購物車">
            <Link to="/cart">
              <CartIcon
                className={`w-6 h-6 ${isMenuOpen ? "stroke-secondary" : "stroke-primary"}`}
              />
              <span
                className={`absolute -top-2 -right-3 rounded-full w-5 h-5 inline-flex text-xs items-center justify-center ${
                  isMenuOpen ? "bg-secondary" : "bg-primary text-secondary"
                }`}
              >
                {totalQuantity}
              </span>
            </Link>
          </Tooltip>
        </div>
      </header>
      <hr className={`border-primary ${isScrolled && "-mx-8"}`} />
      {isMenuOpen && (
        <div className="overflow-y-auto">
          <Navigation handleMenuClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
