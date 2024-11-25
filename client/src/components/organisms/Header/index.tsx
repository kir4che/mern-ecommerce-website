import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Logo from "@/components/atoms/Logo";
import Tooltip from "@/components/atoms/Tooltip";
import Navigation from "@/components/molecules/Navigation";
import { useCart } from "@/hooks/useCart";
import MenuUser from "@/components/molecules/MenuUser";

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const { totalQuantity, isAdded } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative flex-1">
      <Tooltip isActivated={isAdded} text="已加到購物車" />
      <div
        className={`${isMenuOpen ? "header-hidden" : "header-reset"} px-5 duration-700 ease-in-out md:px-8`}
      >
        <div
          className={`flex items-center duration-700 h-24 ${isScrolled ? "sm:h-14 xl:h-16" : "sm:h-20 xl:h-24"}`}
        >
          <div className="flex items-center gap-2 sm:flex-1">
            <button
              className={`p-3 z-50 ${isScrolled ? "sm:p-1.5 xl:p-2" : "sm:p-2 lg:p-3 xl:p-3.5"} duration-700 bg-secondary border-2 sm:border-[1.75px] rounded-full border-primary`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <img
                  width="16"
                  height="16"
                  src="https://img.icons8.com/material/30/delete-sign--v1.png"
                  className="min-w-5 sm:min-w-4"
                  alt="close"
                />
              ) : (
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-glyphs/30/menu--v3.png"
                  className="w-6 sm:w-4 xl:w-5"
                  alt="menu"
                />
              )}
            </button>
            <p className="hidden text-xs xl:text-sm xl:font-medium md:inline">
              Menu
            </p>
          </div>
          <Link
            to="/"
            className={`${isMenuOpen ? "header__logo-hidden" : "header__logo-reset"} header__logo`}
          >
            <Logo
              className={isScrolled ? "sm:w-36 xl:w-40" : "sm:w-40 xl:w-48"}
            />
          </Link>
          <div
            className={`${isMenuOpen ? "gap-2 md:flex" : "flex-1 sm:flex"} items-center justify-end hidden`}
          >
            <MenuUser isMenuOpen={isMenuOpen} />
            <Link
              to="/cart"
              className="flex items-center gap-1.5 ml-4 text-xs xl:text-sm min-w-fit"
            >
              <span
                className={`${isMenuOpen ? "text-secondary" : ""} xl:font-medium`}
              >
                購物車
              </span>
              <span
                className={`${isMenuOpen ? "bg-secondary" : "bg-primary text-secondary"} rounded-full w-6 inline-flex items-center justify-center h-6`}
              >
                {totalQuantity}
              </span>
            </Link>
          </div>
        </div>
        <div className="w-full border-t border-primary" />
      </div>
      <div className={isMenuOpen ? "menu__bg-reset" : "menu__bg-hidden"}>
        <Navigation
          className={isMenuOpen ? "menu__list" : "hidden"}
          handleMenuOpen={() => setIsMenuOpen(!isMenuOpen)}
        />
        <section className="flex items-center justify-between md:hidden">
          <div className="flex gap-2 text-lg font-medium">
            <MenuUser isMenuOpen={isMenuOpen} />
          </div>
          <button
            className="space-x-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-lg font-medium text-secondary">購物車</span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary">
              {totalQuantity}
            </span>
          </button>
        </section>
      </div>
    </header>
  );
};

export default Header;
