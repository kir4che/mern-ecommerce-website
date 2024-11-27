import { useEffect, useState } from "react";

import HeaderMenu from "@/components/organisms/HeaderMenu";
import Footer from "@/components/organisms/Footer";

import shopImage from "@/assets/images/about/shop1.jpg";

const AppLayout = ({ className = "", children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isMenuOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className={`w-full h-full bg-secondary z-50 ${isMenuOpen ? "flex absolute flex-col md:flex-row" : "sticky top-0"}`}
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
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
