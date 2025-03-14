import { ReactComponent as ArrowDownIcon } from "@/assets/icons/nav-arrow-down.inline.svg";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => (
  <details
    role="region"
    className="py-5 text-sm border-b border-gray-400 group"
    open
  >
    <summary className="flex items-center justify-between cursor-pointer">
      <p className="font-medium">{title}</p>
      <ArrowDownIcon className="w-4 h-4 transform group-hover:rotate-180" />
    </summary>
    <p className="border-t-[1.25px] pt-4 mt-4 border-gray-300 border-dashed">
      {children}
    </p>
  </details>
);

export default Accordion;
