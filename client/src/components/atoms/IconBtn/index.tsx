import React from "react";

interface IconBtnProps {
  onClick?: () => void;
  icon: JSX.Element;
  isInMenu: boolean;
  children?: React.ReactNode;
}

const IconBtn: React.FC<IconBtnProps> = ({
  onClick,
  icon,
  isInMenu,
  children,
}) => (
  <button
    className="flex items-center min-w-fit gap-1 md:gap-0.5"
    onClick={onClick}
  >
    {icon}
    <span className={`text-sm hover:underline ${isInMenu && "text-secondary"}`}>
      {children}
    </span>
  </button>
);

export default IconBtn;
