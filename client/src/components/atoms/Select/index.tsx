import { useState } from "react";
import { useNavigate } from "react-router";

import { cn } from "@/utils/cn";

interface SelectProps {
  name?: string;
  label?: string;
  value?: string | string[];
  options: { label: string; value: string }[];
  defaultText?: string;
  multiple?: boolean;
  required?: boolean;
  className?: string;
  optionsContainerClassName?: string;
  optionClassName?: string;
  onChange?: (name: string, value: string | string[]) => void;
}

const Select = ({
  name = "nav-select",
  label,
  value,
  options = [],
  defaultText,
  multiple = false,
  required = false,
  className,
  optionsContainerClassName,
  optionClassName,
  onChange,
}: SelectProps) => {
  const navigate = useNavigate();
  const isControlled = value !== undefined;

  const normalizeValues = (input?: string | string[]) => {
    if (Array.isArray(input)) return input;
    if (typeof input === "string" && input) return [input];
    return [];
  };

  const initialValues =
    !isControlled && multiple && required && options[0]?.value
      ? [options[0].value]
      : normalizeValues(value);

  const [uncontrolledValues, setUncontrolledValues] =
    useState<string[]>(initialValues);
  const selectedValues = isControlled
    ? normalizeValues(value)
    : uncontrolledValues;

  const applyValues = (nextValues: string[]) => {
    if (!isControlled) setUncontrolledValues(nextValues);
    onChange?.(name, nextValues);
  };

  const toggleValue = (optionValue: string) => {
    const hasValue = selectedValues.includes(optionValue);
    if (hasValue && required && selectedValues.length === 1) return;

    const nextValues = hasValue
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    applyValues(nextValues);
  };

  if (multiple)
    return (
      <fieldset className={cn("space-y-2", className)}>
        {label && <legend className="text-sm font-medium">{label}</legend>}
        <div className={cn("flex flex-col gap-2", optionsContainerClassName)}>
          {options.map(({ label: optionLabel, value: optionValue }) => {
            const id = `${name}-${optionValue}`;
            const checked = selectedValues.includes(optionValue);

            return (
              <label
                key={optionValue}
                htmlFor={id}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  optionClassName
                )}
              >
                <input
                  id={id}
                  type="checkbox"
                  aria-label={optionLabel}
                  checked={checked}
                  onChange={() => toggleValue(optionValue)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm">{optionLabel}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );

  const handleSingleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value;
    if (!isControlled) setUncontrolledValues(nextValue ? [nextValue] : []);

    if (onChange) onChange(name, nextValue);
    else if (nextValue) navigate(nextValue);
  };

  const singleValue = selectedValues[0] ?? "";

  return (
    <div className={cn("form-control w-full space-y-1", className)}>
      {label && (
        <label htmlFor={name} className="label pb-0">
          <span className="label-text text-[13px]">{label}</span>
        </label>
      )}
      <select
        id={name}
        name={name}
        value={singleValue}
        data-testid={name}
        onChange={handleSingleChange}
        className="select select-bordered cursor-pointer outline-none w-full focus:outline-none"
        aria-label={label || name}
        required={required}
      >
        {defaultText && (
          <option value="" disabled={required} hidden={required}>
            {defaultText}
          </option>
        )}
        {options.map(({ label: optionLabel, value: optionValue }) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
