import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/context/ThemeContext";
import { AlertProvider } from "@/context/AlertContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { router } from "@/routes";

import "./style.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <AlertProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </AlertProvider>
  </ThemeProvider>
);
