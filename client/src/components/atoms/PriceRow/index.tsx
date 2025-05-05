import { addComma } from "@/utils/addComma";

interface PriceRowProps {
	label: string;
	value: number;
	className?: string;
}

const PriceRow: React.FC<PriceRowProps> = ({ label, value, className }) => {
  if (value <= 0) return null;

  return (
    <div className={`flex justify-between w-full ${className}`}>
      <p>{label}</p>
      <p className={className}>NT$ {addComma(value)}</p>
    </div>
  );
};

export default PriceRow;
