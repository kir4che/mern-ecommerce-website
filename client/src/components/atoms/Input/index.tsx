import React, { ChangeEvent, useState } from "react";

interface InputProperty {
  value: string | number;
  label?: string;
  type?: "text" | "number" | "email" | "password";
  id?: string;
  placeholder?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string | null;
  className?: string;
  iconStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
  [key: string]: any;
}

const Input: React.FC<InputProperty> = ({
  value,
  label,
  type = "text",
  id,
  placeholder,
  icon: Icon,
  onChange = () => {},
  required = false,
  error,
  className,
  iconStyle,
  labelStyle,
  inputStyle,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const hasError = touched && ((!value && required) || error);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    onChange(e);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm ${hasError && "text-red-500"} ${labelStyle}`}
        >
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 input focus-within:outline-none input-bordered ${hasError && "border-red-500 focus-within:border-red-500"} ${inputStyle}`}
      >
        {Icon && (
          <Icon
            className={`w-5 ${hasError ? "stroke-red-400 text-red-400" : "stroke-current"} ${iconStyle}`}
          />
        )}
        <input
          className={`border-none grow ${hasError && "placeholder-red-400 text-red-500"}`}
          type={type}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onInvalid={() => setTouched(true)}
          required={required}
          {...props}
        />
      </div>
      {error && touched && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
