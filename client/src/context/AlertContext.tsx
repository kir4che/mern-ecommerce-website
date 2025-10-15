import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface Alert {
  variant: "info" | "success" | "error";
  message: string;
  autoDismiss?: boolean; // 是否自動消失
  dismissTimeout?: number; // 自動消失時間
  floating?: boolean; // 位置是否浮動
  top?: string; // 距離頂部的距離
}

interface AlertContextType {
  alert: Alert | null;
  showAlert: (alert: Alert) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null);

  // 顯示 Alert
  const showAlert = useCallback((newAlert: Alert) => {
    setAlert({
      autoDismiss: true,
      floating: true,
      top: "top-4",
      ...newAlert, // 保留傳入的屬性，優先級較高
    });
  }, []);

  // 隱藏 Alert
  const hideAlert = useCallback(() => setAlert(null), []);

  useEffect(() => {
    if (alert && alert.autoDismiss !== false) {
      const dismissTime = alert.dismissTimeout || 3000;
      const timer = setTimeout(hideAlert, dismissTime);

      return () => clearTimeout(timer); // 清除計時器
    }
  }, [alert]);

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent<Alert>;
        if (ce?.detail) showAlert(ce.detail);
      } catch {}
    };
    window.addEventListener("app:alert", handler as EventListener);
    return () =>
      window.removeEventListener("app:alert", handler as EventListener);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === null) {
    throw new Error("useAlert 必須在 AlertProvider 內被使用！");
  }
  return context;
};
