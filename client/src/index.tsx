import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";

import { ThemeProvider } from "@/context/ThemeContext";
import { AlertProvider } from "@/context/AlertContext";
import { CartProvider } from "@/context/CartContext";
import { store } from "@/store";
import { router } from "@/routes";

import "./style.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ThemeProvider>
      <AlertProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AlertProvider>
    </ThemeProvider>
  </Provider>,
);
