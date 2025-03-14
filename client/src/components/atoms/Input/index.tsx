import { useState } from "react";

interface InputProps {
  id?: string;
  name?: string;
  type?: "text" | "number" | "email" | "password" | "tel" | "date" | "file";
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  errorMessage?: string;
  helperText?: string;
  containerStyle?: string;
  wrapperStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
  numberStyle?: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange = () => {},
  required = false,
  pattern,
  errorMessage,
  helperText,
  containerStyle = "",
  wrapperStyle = "flex-col gap-1",
  labelStyle = "",
  inputStyle = "",
  numberStyle = "rounded-none h-fit p-0",
  icon: Icon,
  ...props
}) => {
  const [errorState, setErrorState] = useState<boolean>(false);

  const handleValidation = (value: string | number) => {
    if (required && !value) {
      setErrorState(true);
      return;
    }

    // 檢查是否符合正則表達式，並且不允許是0
    if (pattern && value && !pattern.value.test(value.toString())) {
      setErrorState(true);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorState(false);
    handleValidation(e.target.value);
    onChange(e);
  };

  return (
    <div className={`flex flex-col gap-1 ${containerStyle}`}>
      <div className={`flex ${wrapperStyle}`}>
        {label && (
          <label
            htmlFor={id}
            className={`text-sm ${errorState ? "text-red-600" : ""} ${labelStyle}`}
          >
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <div
          className={`flex items-center gap-2 input focus-within:outline-none input-bordered
          ${errorState ? "border-red-600 focus-within:border-red-600" : ""}
          ${type === "number" ? "pl-2.5 pr-0" + numberStyle : ""}
          ${inputStyle}`}
        >
          {Icon && (
            <Icon
              className={`w-5 ${errorState ? "stroke-red-500 text-red-500" : ""}`}
            />
          )}
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={() => handleValidation(value)}
            onInvalid={() => handleValidation(value)}
            required={required}
            className={`border-none grow ${errorState ? "placeholder-red-300 text-red-600" : ""}`}
            data-testid={id}
            aria-invalid={errorState}
            {...props}
          />
        </div>
      </div>
      {!errorState && helperText && (
        <p className="text-gray-400">{helperText}</p>
      )}
      {errorState && (
        <p className="text-red-600">{errorMessage || pattern?.message}</p>
      )}
    </div>
  );
};

export default Input;
