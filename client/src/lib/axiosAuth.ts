import axios from "axios";
import { logout } from "@/store/slices/authSlice";

let installed = false;
let handlingAuthError = false;

// 自動攔截 authMiddleware 產生的錯誤
// - 呼叫後端登出以清 cookie
// - 清空前端登入狀態並導回登入頁
export function installAxiosAuthInterceptor(dispatch: (action: any) => any) {
  if (installed) return;
  installed = true;
  axios.defaults.withCredentials = true;

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const url: string = error?.config?.url || "";
      const isAuthRoute =
        /\/user\/(login|logout|register|reset-password|update-password)/.test(
          url,
        );
      const serverMsg: string | undefined = error?.response?.data?.message;
      const serverCode: string | undefined = error?.response?.data?.code;

      if (status === 403 && !isAuthRoute) {
        try {
          window.dispatchEvent(
            new CustomEvent("app:alert", {
              detail: {
                variant: "error",
                message:
                  serverMsg ||
                  (serverCode === "FORBIDDEN"
                    ? "沒有權限執行此操作！"
                    : "沒有權限存取此資源！"),
                dismissTimeout: 750,
              },
            }),
          );
        } catch (_) {}
        setTimeout(() => {
          if (window.location.pathname !== "/") window.location.replace("/");
        }, 1200);
      } else if (status === 401 && !isAuthRoute) {
        if (!handlingAuthError) {
          handlingAuthError = true;
          try {
            window.dispatchEvent(
              new CustomEvent("app:alert", {
                detail: {
                  variant: "error",
                  message: serverMsg || "登入已失效，請重新登入。",
                  dismissTimeout: 750,
                },
              }),
            );
          } catch (_) {}
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/user/logout`,
              undefined,
              { withCredentials: true },
            );
          } catch (_) {}

          try {
            await dispatch(logout());
          } catch (_) {}

          const current = window.location.pathname + window.location.search;
          const loginPath = `/login?from=${encodeURIComponent(current)}`;
          if (!window.location.pathname.startsWith("/login")) {
            setTimeout(() => window.location.replace(loginPath), 750);
          }
        }
      }

      handlingAuthError = false;
      return Promise.reject(error);
    },
  );
}
