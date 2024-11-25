const IconBtn = ({ onClick = () => {}, icon, isInMenu = false, text }) => (
  <button
    className="flex items-center min-w-fit gap-1 md:gap-0.5"
    onClick={onClick}
  >
    {icon}
    {text && (
      <span
        className={`${isInMenu ? "text-secondary" : ""} text-sm md:text-xs hover:underline`}
      >
        {text}
      </span>
    )}
  </button>
);

export default IconBtn;
