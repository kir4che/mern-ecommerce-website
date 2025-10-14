import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import HeaderMenu from "@/components/organisms/HeaderMenu";
import Footer from "@/components/organisms/Footer";
import Alert from "@/components/atoms/Alert";

import shopImage from "@/assets/images/about/shop1.jpg";

interface AppLayoutProps {
  className?: string;
}

const AppLayout = ({ className = "" }: AppLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isMenuOpen]);

  return (
    <div className="relative flex flex-col min-h-screen">
      <div
        className={`top-0 min-h-full bg-secondary z-50 ${isMenuOpen ? "flex fixed flex-col md:flex-row" : "sticky"}`}
      >
        <HeaderMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div
          className={`flex-1 xl:basis-96 ${isMenuOpen ? "block" : "hidden"}`}
        >
          <img
            src={shopImage}
            alt="menu-cover"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <main
        className={`flex-1 relative flex flex-col justify-center w-full ${className}`}
      >
        <Alert />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
