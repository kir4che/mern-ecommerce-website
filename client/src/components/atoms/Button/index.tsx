import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "link" | "icon";
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "start" | "end";
  iconStyle?: string;
}

const Button = ({
  type = "button",
  variant = "primary",
  icon: Icon,
  iconPosition = "start",
  iconStyle = "stroke-current",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const variantStyles = {
    primary:
      "bg-slate-900 text-white border-none hover:bg-slate-800 disabled:bg-slate-200 disabled:text-gray-400",
    secondary:
      "border-slate-900 hover:bg-slate-900 hover:text-white disabled:border-slate-200 disabled:text-gray-300 disabled:hover:bg-transparent",
    outline:
      "border-slate-900 hover:opacity-80 disabled:border-slate-200 disabled:text-gray-300",
    link: "border-none no-underline hover:underline hover:underline-offset-4 disabled:text-gray-300 disabled:no-underline",
    icon: "border-none p-1 disabled:opacity-40",
  };

  const sizeStyles =
    variant === "link" || variant === "icon" ? "" : "px-4 py-1.5";

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "flex-center gap-1 duration-300 transition-all border font-medium disabled:cursor-not-allowed disabled:shadow-none",
        variantStyles[variant],
        sizeStyles,
        className
      )}
      {...props}
    >
      {Icon && iconPosition === "start" && (
        <Icon className={cn("size-5 shrink-0", iconStyle)} />
      )}
      {children && <span>{children}</span>}
      {Icon && iconPosition === "end" && (
        <Icon className={cn("size-5 shrink-0", iconStyle)} />
      )}
    </button>
  );
};

export default Button;
