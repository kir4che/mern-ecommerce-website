interface TooltipProperty {
  isActivated: boolean;
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProperty> = ({
  isActivated,
  text,
  children,
}) => (
  <p
    className={`tooltip tooltip-bottom ${isActivated && "tooltip-open"}`}
    {...(isActivated ? { "data-tip": text } : {})}
  >
    {children}
  </p>
);

export default Tooltip;
