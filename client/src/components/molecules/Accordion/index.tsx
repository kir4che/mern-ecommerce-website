interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => (
  <details className="py-5 text-sm border-b border-gray-400 group" open>
    <summary className="flex items-center justify-between cursor-pointer">
      <p className="font-medium">{title}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="9"
        fill="none"
        className="block group-open:rotate-180"
        viewBox="0 0 16 9"
      >
        <path
          fill="#081122"
          d="M.358.353a.5.5 0 0 1 .707 0l6.56 6.56 6.561-6.56a.5.5 0 1 1 .707.708L7.626 8.328.358 1.061a.5.5 0 0 1 0-.708Z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </summary>
    <p className="border-t-[1.25px] pt-4 mt-4 border-gray-300 border-dashed">
      {children}
    </p>
  </details>
);

export default Accordion;
