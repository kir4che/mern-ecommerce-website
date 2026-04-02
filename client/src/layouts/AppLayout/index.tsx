import { Outlet, ScrollRestoration } from "react-router";

import Alert from "@/components/atoms/Alert";
import Footer from "@/components/organisms/Footer";
import HeaderMenu from "@/components/organisms/HeaderMenu";

const AppLayout = () => (
  <div className="flex flex-col min-h-dvh">
    <HeaderMenu />
    <main className="relative flex flex-col flex-1 w-full">
      <Outlet />
    </main>
    <Footer />
    <Alert />
    <ScrollRestoration />
  </div>
);

export default AppLayout;
