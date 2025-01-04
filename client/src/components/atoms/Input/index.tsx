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
  labelStyle?: string;
  inputStyle?: string;
  validation?: {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
  };
  errorMessage?: string;
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
  className='flex-col gap-1',
  labelStyle,
  inputStyle,
  validation,
  errorMessage,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    onChange(e);
  };

  const handleValidation = (value: string) => {
    if (validation?.required && !value) {
      setErrorState('此欄位為必填');
      return;
    }
    // 其他驗證邏輯...
  }

  return (
    <div className={`flex ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm ${errorState && "text-red-600"} ${labelStyle}`}
        >
          {label}
        </label>
      )}
      <div className={`flex items-center gap-2 input focus-within:outline-none input-bordered ${errorState && "border-red-600 focus-within:border-red-600"} ${inputStyle}`}>
        {Icon && (
          <Icon className={`w-5 ${errorState ? "stroke-red-500 text-red-500" : "stroke-current"}`} />
        )}
        <input
          className={`border-none grow ${errorState && "placeholder-red-500 text-red-600"}`}
          type={type}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            handleValidation(e.target.value);
            handleChange(e);
          }}
          onInvalid={() => setTouched(true)}
          required={required}
          {...props}
        />
      </div>
      {errorState && touched && (
        <span className="text-sm text-red-600">{errorState}</span>
      )}
    </div>
  );
};

export default Input;
