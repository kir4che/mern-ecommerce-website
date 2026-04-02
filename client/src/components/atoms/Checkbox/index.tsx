import { cn } from "@/utils/cn";
import { ChangeEvent } from "react";

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;

interface CheckboxProps extends Omit<NativeInputProps, "type" | "onChange"> {
  id: string;
  label: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelStyle?: string;
}

const Checkbox = ({
  id,
  label,
  onChange = () => {},
  className = "",
  labelStyle = "",
  ...props
}: CheckboxProps) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <input
        type="checkbox"
        id={id}
        onChange={onChange}
        className="size-5 rounded-full checkbox"
        data-testid={id}
        {...props}
      />
      <label htmlFor={id} className={cn("text-sm", labelStyle)}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
