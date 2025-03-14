import { useAlert } from "@/context/AlertContext";

import { ReactComponent as InfoIcon } from "@/assets/icons/info.inline.svg";
import { ReactComponent as WarningIcon } from "@/assets/icons/warning.inline.svg";
import { ReactComponent as SuccessIcon } from "@/assets/icons/success.inline.svg";
import { ReactComponent as ErrorIcon } from "@/assets/icons/error.inline.svg";

const iconMap = {
  info: {
    icon: InfoIcon,
    style: "alert-info bg-sky-50 text-sky-600",
  },
  warning: {
    icon: WarningIcon,
    style: "alert-warning bg-yellow-50 text-yellow-600",
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

const Alert: React.FC = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  const { variant, message, floating, top } = alert;
  const Icon = iconMap[variant].icon;

  return (
    <div
      role="alert"
      className={`alert ${iconMap[variant].style} flex text-nowrap items-center rounded-md gap-2 border-none py-2.5  w-fit transition-opacity duration-500 font-medium ${floating ? "absolute -translate-x-1/2 left-1/2 top-4" : ""}`}
    >
      <Icon className="w-5 stroke-current" />
      <p>{message}</p>
    </div>
  );
};

export default Alert;
