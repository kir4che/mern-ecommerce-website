import { cn } from "@/utils/cn";
import { ComponentProps } from "react";

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  helperText?: string;
  textareaClassName?: string;
}

const Textarea = ({
  id,
  label,
  error,
  helperText,
  required,
  className,
  textareaClassName,
  ref,
  ...props
}: TextareaProps) => {
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
      <textarea
        ref={ref}
        id={id}
        required={required}
        aria-invalid={isInvalid}
        className={cn(
          "textarea textarea-bordered w-full focus:outline-none",
          isInvalid && "textarea-error",
          textareaClassName
        )}
        {...props}
      />
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

export default Textarea;
