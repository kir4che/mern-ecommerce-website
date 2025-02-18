import React, { ChangeEvent, useState } from "react";

interface InputProps {
  value: string | number;
  label?: string;
  type?: "text" | "number" | "email" | "password" | "tel";
  id?: string;
  placeholder?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string | null;
  className?: string;
  labelStyle?: string;
  inputStyle?: string;
  helperText?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  errorMessage?: string;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
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
  helperText,
  pattern,
  errorMessage,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    handleValidation(e.target.value);
    onChange(e);
  };

  const handleValidation = (value: string) => {
    if (required && !value) {
      setErrorState('此為必填欄位');
      return;
    }
    if (pattern && value && !pattern.value.test(value)) {
      setErrorState(pattern.message || '輸入格式不正確');
      return;
    }
    setErrorState(null);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className={`flex ${className}`}>
        {label && (
          <label htmlFor={id} className={`text-sm ${errorState && "text-red-600"} ${labelStyle}`}>
            {label}
          </label>
        )}
        <div className={`flex items-center gap-2 input focus-within:outline-none input-bordered ${errorState && "border-red-600 focus-within:border-red-600"} ${inputStyle}`}>
          {Icon && <Icon className={`w-5 ${errorState && "stroke-red-500 text-red-500"}`} />}
          <input
            type={type}
            id={id}
            value={value}
            placeholder={placeholder}
            className={`border-none grow ${errorState && "placeholder-red-300 text-red-600"}`}
            onChange={handleChange}
            onBlur={() => {
              setTouched(true);
              handleValidation(value.toString());
            }}
            onInvalid={(e) => {
              e.preventDefault();
              setTouched(true);
              handleValidation(value.toString());
            }}
            required={required}
            {...props}
          />
        </div>
      </div>
      {helperText && !errorState && <p className="text-gray-400">{helperText}</p>}
      {errorState && touched && <p className="text-red-600">{errorState}</p>}
    </div>
  );
};

export default Input;
