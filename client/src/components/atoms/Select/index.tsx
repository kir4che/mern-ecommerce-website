interface SelectProps {
  name: string;
  label: string;
  value: string | string[];
  defaultText?: string;
  options: { value: string; label: string }[];
  onChange?: (name: string, value: string | string[]) => void;
  required?: boolean;
  multiple?: boolean;
  containerStyle?: string;
  wrapperStyle?: string;
  selectStyle?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  value = "",
  defaultText,
  options,
  onChange = () => {},
  required = false,
  multiple = false,
  containerStyle = "",
  wrapperStyle = "",
  selectStyle = "",
}) => {
  // 如果是多選且必填，預設勾選第一個選項。
  const defaultValue =
    multiple && required && Array.isArray(value) && value.length === 0
      ? [options[0]?.value]
      : value;

  const handleMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: selectedValue, checked } = e.target;

    let updatedValues = Array.isArray(defaultValue) ? [...defaultValue] : [];
    if (checked) updatedValues.push(selectedValue);
    else {
      if (required && updatedValues.length === 1) return; // 必填時，不能取消最後一個勾選的選項。
      updatedValues = updatedValues.filter((v) => v !== selectedValue);
    }

    onChange(name, updatedValues);
  };

  return (
    <div className={`form-control ${containerStyle}`}>
      <span className="text-sm leading-6">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {multiple && (
        <p className="mb-2 text-xs text-gray-500">可選擇一或多個選項</p>
      )}
      <div className={`flex flex-col gap-y-2 ${wrapperStyle}`}>
        {multiple ? (
          options.map(({ value: optValue, label: optLabel }) => (
            <div key={optValue} className="flex items-center gap-x-1.5">
              <input
                id={`${name}-${optValue}`}
                name={name}
                type="checkbox"
                value={optValue}
                checked={
                  Array.isArray(defaultValue) && defaultValue.includes(optValue)
                }
                onChange={handleMultipleChange}
                className={selectStyle}
                data-testid={name}
              />
              <label htmlFor={`${name}-${optValue}`} className="text-sm">
                {optLabel}
              </label>
            </div>
          ))
        ) : (
          <select
            name={name}
            value={defaultValue}
            onChange={(e) => onChange(name, e.target.value)}
            required={required}
            className={`text-base select select-bordered focus:outline-none ${selectStyle}`}
            data-testid={name}
          >
            {defaultText && <option value="">{defaultText}</option>}
            {options.map(({ value: optValue, label: optLabel }) => (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Select;
