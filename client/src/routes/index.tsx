import { createBrowserRouter } from "react-router";

import AppLayout from "@/layouts/AppLayout";
import PrivateRoute from "@/routes/PrivateRoute";

import App from "@/App";
import About from "@/pages/about";
import News from "@/pages/news";
import New from "@/pages/news/[id]";
import FAQ from "@/pages/faq";
import Contact from "@/pages/contact";
import Collections from "@/pages/collections/[category]";
import Product from "@/pages/products/[id]";
import Register from "@/pages/register";
import Login from "@/pages/login";
import RequestResetLink from "@/pages/reset-password";
import ResetPassword from "@/pages/reset-password/[token]";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout/[id]";
import UserDashboard from "@/pages/dashboard/user";
import AdminDashboard from "@/pages/dashboard/admin";
import NotFound from "@/pages/notFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "about", element: <About /> },
      { path: "news", element: <News /> },
      { path: "news/:id", element: <New /> },
      { path: "faq", element: <FAQ /> },
      { path: "contact", element: <Contact /> },
      { path: "collections/:category", element: <Collections /> },
      { path: "products/:id", element: <Product /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <RequestResetLink /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
      {
        path: "cart",
        element: <PrivateRoute component={Cart} />,
      },
      {
        path: "checkout/:id",
        element: <PrivateRoute component={Checkout} />,
      },
      {
        path: "my-account",
        element: <PrivateRoute component={UserDashboard} />,
      },
      {
        path: "admin/dashboard",
        element: <PrivateRoute component={AdminDashboard} />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
