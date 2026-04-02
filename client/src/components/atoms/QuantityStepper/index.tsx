import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

import MinusIcon from "@/assets/icons/minus.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";
import { cn } from "@/utils/cn";

type StepperSize = "sm" | "md" | "lg";

interface QuantityStepperProps {
  size?: StepperSize;
  variant?: "buttons" | "native";
  value: number;
  max: number;
  min?: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
  className?: string;
}

const SIZE_CONFIG: Record<
  StepperSize,
  { btn: string; inputWrap: string; inputCore: string }
> = {
  sm: {
    btn: "h-7 min-h-7 px-1.5",
    inputWrap: "w-10",
    inputCore: "h-7 text-xs",
  },
  md: {
    btn: "h-8 min-h-8 px-2.5",
    inputWrap: "w-12",
    inputCore: "h-8 text-sm",
  },
  lg: {
    btn: "h-9 min-h-9 px-3",
    inputWrap: "w-16",
    inputCore: "h-9 text-base font-medium",
  },
};

const QuantityStepper = ({
  size = "md",
  variant = "buttons",
  value,
  max,
  min = 1,
  onChange,
  disabled = false,
  className = "",
}: QuantityStepperProps) => {
  const config = SIZE_CONFIG[size];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseInt(e.target.value, 10);
    if (isNaN(rawValue)) return;

    const clampedValue = Math.max(min, Math.min(rawValue, max));
    onChange(clampedValue);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  if (variant === "native")
    return (
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={cn(config.inputWrap, className)}
        inputClassName={cn("native-number-spin pl-2", config.inputCore)}
      />
    );

  return (
    <div className={cn("join", className)}>
      <Button
        icon={MinusIcon}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={cn("join-item", config.btn)}
        aria-label="減少數量"
      />
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={cn("join-item", config.inputWrap)}
        inputClassName={cn(
          "text-center hide-number-spin border-y-gray-200 border-x-0 rounded-none focus:outline-none focus:ring-0",
          config.inputCore
        )}
      />
      <Button
        icon={PlusIcon}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={cn("join-item", config.btn)}
        aria-label="增加數量"
      />
    </div>
  );
};

export default QuantityStepper;
