import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddToCartInputBtn from "@/components/molecules/AddToCartInputBtn";
import type { Product } from "@/types/product";

const mockAddToCartInput = jest.fn();
const mockAddToCartBtn = jest.fn();

type AddToCartInputProps = {
  quantity: number;
  setQuantity: (n: number) => void;
  onQuantityChange?: (n: number) => void;
};

type AddToCartBtnProps = {
  quantity: number;
  onAddSuccess?: () => void;
};

jest.mock("@/components/molecules/AddToCartInputBtn/AddToCartInput", () => {
  const MockAddToCartInput: React.FC<AddToCartInputProps> = (props) => {
    mockAddToCartInput(props);
    return (
      <button
        type="button"
        data-testid="add-to-cart-input"
        onClick={() => {
          props.setQuantity(3);
          props.onQuantityChange?.(3);
        }}
      >
        input
      </button>
    );
  };
  MockAddToCartInput.displayName = "MockAddToCartInput";
  return { __esModule: true, default: MockAddToCartInput };
});

jest.mock("@/components/molecules/AddToCartInputBtn/AddToCartBtn", () => {
  const MockAddToCartBtn: React.FC<AddToCartBtnProps> = (props) => {
    mockAddToCartBtn(props);
    return (
      <button
        type="button"
        data-testid="add-to-cart-btn"
        onClick={() => props.onAddSuccess?.()}
      >
        add
      </button>
    );
  };
  MockAddToCartBtn.displayName = "MockAddToCartBtn";
  return { __esModule: true, default: MockAddToCartBtn };
});

const product: Partial<Product> = { _id: "product-1", countInStock: 5 };

describe("AddToCartInputBtn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("passes initial quantity to child components", () => {
    render(<AddToCartInputBtn product={product} />);
    expect(mockAddToCartInput).toHaveBeenCalled();
    expect(mockAddToCartBtn).toHaveBeenCalled();
    expect(mockAddToCartInput.mock.calls[0][0].quantity).toBe(1);
    expect(mockAddToCartBtn.mock.calls[0][0].quantity).toBe(1);
  });

  test("updates quantity when input triggers change", () => {
    const onQuantityChange = jest.fn();
    render(
      <AddToCartInputBtn
        product={product}
        onQuantityChange={onQuantityChange}
      />
    );
    fireEvent.click(screen.getByTestId("add-to-cart-input"));
    expect(onQuantityChange).toHaveBeenCalledWith(3);
    const lastCall = mockAddToCartBtn.mock.calls.at(-1)![0];
    expect(lastCall.quantity).toBe(3);
  });

  test("resets quantity to 1 after successful add", () => {
    const onAddSuccess = jest.fn();
    render(<AddToCartInputBtn product={product} onAddSuccess={onAddSuccess} />);
    fireEvent.click(screen.getByTestId("add-to-cart-btn"));
    expect(onAddSuccess).toHaveBeenCalled();
    const lastInputCall = mockAddToCartInput.mock.calls.at(-1)![0];
    expect(lastInputCall.quantity).toBe(1);
  });
});
