import { ComponentProps } from "react";

import { cn } from "@/utils/cn";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  inputClassName?: string;
}

const Input = ({
  id,
  label,
  error,
  helperText,
  icon: Icon,
  className,
  inputClassName,
  required,
  ref,
  ...props
}: InputProps) => {
  const isInvalid = !!error;

  return (
    <div className={cn("form-control w-full space-y-1", className)}>
      {label && (
        <label htmlFor={id} className="label">
          <span
            className={cn(
              "label-text text-[13px]",
              isInvalid && "text-red-600"
            )}
          >
            {label} {required && <span className="text-red-600 ml-0.5">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            className={cn(
              "absolute left-3 z-10 size-5 text-gray-500 pointer-events-none",
              isInvalid && "text-red-600"
            )}
          />
        )}
        <input
          ref={ref}
          id={id}
          required={required}
          aria-invalid={isInvalid}
          className={cn(
            "input input-bordered w-full focus:outline-none",
            Icon && "pl-10",
            isInvalid && "input-error",
            inputClassName
          )}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <div className="label text-[13px] mt-1">
          <span className={isInvalid ? "text-red-600" : "text-gray-500"}>
            {error || helperText}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;
