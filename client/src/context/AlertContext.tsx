import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  const showAlert = (newAlert: Alert) => {
    setAlert({
      autoDismiss: true,
      floating: true,
      top: "top-4",
      ...newAlert, // 保留傳入的屬性，優先級較高
    });
  };

  // 隱藏 Alert
  const hideAlert = () => setAlert(null);

useEffect(() => {
  if (alert && alert.autoDismiss !== false) {
    const dismissTime = alert.dismissTimeout || 3000;
    const timer = setTimeout(hideAlert, dismissTime);
    
    return () => clearTimeout(timer); // 清除計時器
  }
}, [alert]);

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
