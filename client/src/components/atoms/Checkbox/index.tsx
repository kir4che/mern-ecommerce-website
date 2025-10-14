import React, { ChangeEvent } from "react";

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;

interface CheckboxProps extends Omit<NativeInputProps, "type" | "onChange"> {
  id: string;
  label: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelStyle?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  onChange = () => {},
  className = "",
  labelStyle = "",
  ...props
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <input
        type="checkbox"
        id={id}
        onChange={onChange}
        className="w-5 h-5 rounded-full checkbox"
        data-testid={id}
        {...props}
      />
      <label htmlFor={id} className={`text-sm ${labelStyle}`}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
