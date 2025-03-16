interface TooltipProps {
  isActivated: boolean;
  text: string;
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ isActivated, text, children }) => (
  <p
    role="tooltip"
    className={`tooltip tooltip-bottom ${isActivated ? "tooltip-open" : ""}`}
    {...(isActivated ? { "data-tip": text } : {})}
  >
    {children}
  </p>
);

export default Tooltip;
