interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  name?: string;
}

const Accordion = ({
  title,
  children,
  defaultOpen = false,
  name,
}: AccordionProps) => (
  <div className="collapse collapse-arrow border-b border-slate-400 rounded-none group text-sm">
    {name ? (
      <input
        type="radio"
        name={name}
        value={title}
        defaultChecked={defaultOpen}
      />
    ) : (
      <input type="checkbox" defaultChecked={defaultOpen} />
    )}
    <div className="collapse-title py-4 pl-0 font-medium">{title}</div>
    <div className="collapse-content px-0">
      <p className="border-t-[1.25px] border-dashed border-slate-300 pt-4">
        {children}
      </p>
    </div>
  </div>
);

export default Accordion;
