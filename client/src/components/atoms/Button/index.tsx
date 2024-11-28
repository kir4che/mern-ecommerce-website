import React from "react";

interface ButtonProps {
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "link" | "icon";
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "start" | "end";
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  iconStyle?: string;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  icon: Icon,
  iconPosition = "start",
  children,
  onClick = () => {},
  className = "",
  iconStyle = "stroke-primary",
  ...props
}) => (
  <button
    type={type}
    className={`btn
      ${variant === "link" && "btn-link"} 
      ${variant === "icon" && "btn-icon"} 
      ${variant !== "link" && variant !== "icon" && "btn-outline"}
      duration-500 rounded-full 
      ${variant === "secondary" && "text-secondary bg-primary hover:text-primary hover:bg-secondary"} 
      ${className}`}
    onClick={onClick}
    {...props}
  >
    {Icon && (
      <Icon className={`w-5 h-5 ${iconPosition && "order-2"} ${iconStyle}`} />
    )}
    {children}
  </button>
);

export default Button;
