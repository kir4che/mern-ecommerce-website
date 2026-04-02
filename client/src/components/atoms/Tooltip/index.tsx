import { cn } from "@/utils/cn";

interface TooltipProps {
  isActivated: boolean;
  text: string;
  children?: React.ReactNode;
}

const Tooltip = ({ isActivated, text, children }: TooltipProps) => (
  <p
    role="tooltip"
    className={cn("tooltip tooltip-bottom", isActivated ? "tooltip-open" : "")}
    {...(isActivated ? { "data-tip": text } : {})}
  >
    {children}
  </p>
);

export default Tooltip;
