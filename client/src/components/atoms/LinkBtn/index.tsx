import { Link } from "react-router-dom";

const LinkBtn = ({ to, isInMenu = false, className = "", text }) => (
  <Link
    to={to}
    className={`${
      isInMenu
        ? "hover:text-secondary hover:bg-primary border-secondary bg-secondary"
        : "text-secondary hover:text-primary hover:bg-secondary border-primary bg-primary"
    } ${className} text-xxs xl:text-xs min-w-fit px-3 xl:px-5 py-1 xl:py-1.5 transition duration-300 ease-in-out border-[1.5px] rounded-full outline-none`}
  >
    {text}
  </Link>
);

export default LinkBtn;
