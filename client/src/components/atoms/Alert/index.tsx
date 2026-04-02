import { useAlert } from "@/context/AlertContext";
import { cn } from "@/utils/cn";

import ErrorIcon from "@/assets/icons/error.inline.svg?react";
import InfoIcon from "@/assets/icons/info.inline.svg?react";
import SuccessIcon from "@/assets/icons/success.inline.svg?react";
import WarningIcon from "@/assets/icons/warning.inline.svg?react";
import Button from "@/components/atoms/Button";

const iconMap = {
  info: {
    icon: InfoIcon,
    style: "alert-info bg-sky-50 text-sky-600",
    buttonStyle: "bg-sky-100 text-sky-700 hover:bg-sky-200",
  },
  warning: {
    icon: WarningIcon,
    style: "alert-warning bg-yellow-50 text-yellow-600",
    buttonStyle: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  },
  success: {
    icon: SuccessIcon,
    style: "alert-success bg-green-50 text-green-600",
    buttonStyle: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  error: {
    icon: ErrorIcon,
    style: "alert-error bg-red-50 text-red-500",
    buttonStyle: "bg-red-100 text-red-700 hover:bg-red-200",
  },
};

const Alert = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  const { variant, message, floating, action } = alert;

  const currentConfig = iconMap[variant] || iconMap.info;
  const Icon = currentConfig.icon;

  const handleActionClick = () => {
    action?.onClick();
    hideAlert();
  };

  return (
    <div
      role="alert"
      className={cn(
        "alert flex items-center rounded-md gap-3 border-none py-3 px-4 transition-opacity duration-500 font-medium",
        currentConfig.style,
        action ? "flex-row" : "text-nowrap w-fit",
        floating
          ? "fixed -translate-x-1/2 left-1/2 top-20 z-9999 shadow-md max-w-sm"
          : ""
      )}
    >
      <Icon className="size-5 shrink-0 stroke-current" />
      <p className="flex-1">{message}</p>
      {action && (
        <Button
          onClick={handleActionClick}
          className={cn(
            "shrink-0 text-sm font-semibold transition-colors",
            currentConfig.buttonStyle
          )}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default Alert;
