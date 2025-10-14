import { useState } from "react";

type NativeTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface TextareaProps
  extends Omit<NativeTextareaProps, "value" | "onChange"> {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value: string;
  rows?: number;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  errorMessage?: string;
  helperText?: string;
  containerStyle?: string;
  labelStyle?: string;
  inputStyle?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  rows = 3,
  maxLength,
  onChange = () => {},
  required = false,
  errorMessage,
  helperText,
  containerStyle = "",
  labelStyle = "",
  inputStyle = "",
  ...props
}) => {
  const [errorState, setErrorState] = useState<boolean>(false);

  const handleValidation = (value: string) => {
    if (required && !value) {
      setErrorState(true);
      return;
    }
    setErrorState(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleValidation(e.target.value);
    onChange(e);
  };

  return (
    <div className={`flex flex-col gap-1 ${containerStyle}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm ${errorState ? "text-red-600" : ""} ${labelStyle}`}
        >
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onChange={handleChange}
        onBlur={() => handleValidation(value)}
        onInvalid={() => handleValidation(value)}
        required={required}
        className={`textarea focus:outline-none textarea-bordered ${errorState ? "placeholder-red-300 border-red-600 text-red-600 focus:border-red-600" : ""} ${inputStyle}`}
        data-testid={id}
        aria-invalid={errorState}
        {...props}
      />
      {!errorState && helperText && (
        <p className="text-gray-400">{helperText}</p>
      )}
      {errorState && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default Textarea;
