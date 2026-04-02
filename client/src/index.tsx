import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";

import { AlertProvider } from "@/context/AlertContext";
import { ConfirmDialogProvider } from "@/context/ConfirmDialogContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { router } from "@/routes";
import { store } from "@/store";

import "./styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ThemeProvider>
      <AlertProvider>
        <ConfirmDialogProvider>
          <RouterProvider router={router} />
        </ConfirmDialogProvider>
      </AlertProvider>
    </ThemeProvider>
  </Provider>
);
