import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";

import { ThemeProvider } from "@/context/ThemeContext";
import { AlertProvider } from "@/context/AlertContext";
import { store } from "@/store";
import { router } from "@/routes";

import "./style.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ThemeProvider>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </ThemeProvider>
  </Provider>,
);
