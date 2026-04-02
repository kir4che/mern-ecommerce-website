import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { useAddToCartButtonProps } from "@/hooks/useAddToCartButtonProps";

import CartPlusIcon from "@/assets/icons/cart-plus.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";
import Button from "@/components/atoms/Button";

interface AddToCartBtnProps {
  btnType?: "icon" | "text";
  className?: string;
  showIcon?: boolean;
  product: Partial<Product> & { _id: string };
  quantity?: number;
  onAddSuccess?: () => void;
}

const AddToCartBtn = ({
  btnType = "icon",
  className,
  showIcon = true,
  product,
  quantity = 1,
  onAddSuccess,
}: AddToCartBtnProps) => {
  const { isSuccess, isAdding, isOutOfStock, getButtonProps, buttonLabel } =
    useAddToCartButtonProps({
      product,
      quantity,
      onAddSuccess,
    });

  if (btnType === "icon")
    return (
      <Button
        {...getButtonProps({
          variant: "secondary",
          icon: isSuccess ? undefined : PlusIcon,
          className: cn(
            "size-8.5 rounded-full transition-transform",
            !isOutOfStock && !isAdding && "active:scale-95",
            className
          ),
        })}
      >
        {isSuccess && <span className="text-sm font-bold">✔</span>}
      </Button>
    );

  return (
    <Button
      {...getButtonProps({
        icon:
          showIcon && !isOutOfStock && !isAdding && !isSuccess
            ? CartPlusIcon
            : undefined,
        className: cn(
          "w-full transition-transform",
          isSuccess &&
            "text-green-600 border-green-600 bg-green-50 hover:bg-green-50",
          className
        ),
      })}
    >
      {buttonLabel}
    </Button>
  );
};

export default AddToCartBtn;
