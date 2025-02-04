import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as ArrowDownIcon } from "@/assets/icons/nav-arrow-down.inline.svg";

interface DropdownMenuProps {
  title: string;
  list: { label: string; value: string }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, list }) => {
  const detailsRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        detailsRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <details ref={detailsRef} className="dropdown">
      <summary className="h-10 px-2.5 border text-primary rounded-none btn bg-secondary hover:bg-secondary border-primary focus-within:border-primary">
        {title}
        <ArrowDownIcon className="w-4 h-4 ml-2 stroke-primary" />
      </summary>
      <ul className="flex-col p-2 mt-2 rounded-none shadow menu bg-secondary">
        {list.map(({ label, value }, index) => (
          <li key={index}>
            <Link
              to={value}
              className="px-3 py-2 text-base rounded-none hover:bg-primary hover:text-secondary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default DropdownMenu;
