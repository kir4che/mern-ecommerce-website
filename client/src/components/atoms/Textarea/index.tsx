import { useState } from "react";

interface TextareaProps {
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
  [key: string]: any;
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
	containerStyle,
	labelStyle,
	inputStyle,
	...props
}) => {
	const [errorState, setErrorState] = useState<boolean>(false);

	const handleValidation = (value: string) => {
    if (required && !value) {
      setErrorState(true)
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
					<label htmlFor={id} className={`text-sm ${errorState && "text-red-600"} ${labelStyle}`}>
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
					onInvalid={(e) => {
						e.preventDefault();
						handleValidation(value);
					}}
					required={required}
					className={`textarea focus:outline-none textarea-bordered ${errorState && "placeholder-red-300 border-red-600 text-red-600 focus:border-red-600"} ${inputStyle}`}
					{...props}
			/>
			{!errorState && helperText && <p className="text-gray-400">{helperText}</p>}
			{errorState && !required && <p className="text-red-600">{errorMessage}</p>}
		</div>
	);
};


export default Textarea;
