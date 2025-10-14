import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link" | "icon" | "text";
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "start" | "end";
  iconStyle?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  icon: Icon,
  iconPosition = "start",
  iconStyle = "stroke-current",
  children,
  onClick = () => {},
  className = "",
  ...props
}) => (
  <button
    type={type}
    className={`btn
      ${variant === "link" ? "btn-link" : ""} 
      ${variant === "icon" ? "btn-icon" : ""} 
      ${variant === "text" ? "btn-text" : ""}
      ${variant !== "link" && variant !== "icon" && variant !== "text" ? "btn-outline" : ""}
      duration-500 rounded-full 
      ${variant === "secondary" ? "text-secondary bg-primary hover:text-primary hover:bg-secondary" : ""} 
      ${className}`}
    onClick={onClick}
    {...props}
  >
    {Icon && (
      <Icon
        className={`w-5 h-5 ${iconPosition ? "order-2" : ""} ${iconStyle}`}
      />
    )}
    {children}
  </button>
);

export default Button;
