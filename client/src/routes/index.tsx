import { createBrowserRouter } from "react-router";

import AppLayout from "@/layouts/AppLayout";
import PrivateRoute from "@/routes/PrivateRoute";

import App from "@/App";
import About from "@/pages/about";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Collections from "@/pages/collections/[category]";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/dashboard/admin";
import UserDashboard from "@/pages/dashboard/user";
import FAQ from "@/pages/faq";
import Login from "@/pages/login";
import News from "@/pages/news";
import New from "@/pages/news/[id]";
import NotFound from "@/pages/notFound";
import Product from "@/pages/products/[id]";
import Register from "@/pages/register";
import RequestResetLink from "@/pages/reset-password";
import ResetPassword from "@/pages/reset-password/[token]";
import AdminRoute from "@/routes/AdminRoute";

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
      { path: "cart", element: <Cart /> },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "checkout/:id",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "my-account",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
