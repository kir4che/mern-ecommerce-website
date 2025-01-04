import { useState, useEffect } from "react";

import { ReactComponent as InfoIcon } from "@/assets/icons/info.inline.svg";
import { ReactComponent as SuccessIcon } from "@/assets/icons/success.inline.svg";
import { ReactComponent as ErrorIcon } from "@/assets/icons/error.inline.svg";

interface AlertProps {
  type: "info" | "success" | "error";
  message: string;
  autoDismiss?: boolean;
  className?: string;
}

const iconMap = {
  info: {
    icon: InfoIcon,
    style: "alert-info bg-sky-50 text-sky-600",
  },
  success: {
    icon: SuccessIcon,
    style: "alert-success bg-green-50 text-green-600",
  },
  error: {
    icon: ErrorIcon,
    style: "alert-error bg-red-50 text-red-500",
  },
};

const Alert: React.FC<AlertProps> = ({
  type = "info",
  message,
  autoDismiss = true,
  className,
}) => {
  const Icon = iconMap[type].icon;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="alert"
      className={`alert ${iconMap[type].style} flex items-center rounded-md gap-2 border-none py-3 transition-opacity duration-500 font-medium ${isVisible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      <Icon className="w-5 stroke-current" />
      <p className="text-sm font-normal">{message}</p>
    </div>
  );
};

export default Alert;
