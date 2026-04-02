import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";

interface PriceRowProps {
  label: string;
  value: number;
  className?: string;
}

const PriceRow = ({ label, value, className }: PriceRowProps) => {
  if (value <= 0) return null;

  return (
    <div className={cn("flex justify-between w-full", className)}>
      <p>{label}</p>
      <p className={cn(className)}>NT$ {addComma(value)}</p>
    </div>
  );
};

export default PriceRow;
