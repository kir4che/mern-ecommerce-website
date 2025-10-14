import { render, screen, fireEvent } from "@testing-library/react";
import AddToCartInputBtn from "@/components/molecules/AddToCartInputBtn";
import type { Product } from "@/types/product";

const mockAddToCartInput = jest.fn();
const mockAddToCartBtn = jest.fn();

jest.mock(
  "@/components/molecules/AddToCartInputBtn/AddToCartInput",
  () => (props: any) => {
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
  },
);

jest.mock(
  "@/components/molecules/AddToCartInputBtn/AddToCartBtn",
  () => (props: any) => {
    mockAddToCartBtn(props);
    return (
      <button
        type="button"
        data-testid="add-to-cart-btn"
        onClick={() => {
          props.onAddSuccess?.();
        }}
      >
        add
      </button>
    );
  },
);

const product: Partial<Product> = {
  _id: "product-1",
  countInStock: 5,
};

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
      />,
    );

    fireEvent.click(screen.getByTestId("add-to-cart-input"));

    expect(onQuantityChange).toHaveBeenCalledWith(3);
    const lastCall =
      mockAddToCartBtn.mock.calls[mockAddToCartBtn.mock.calls.length - 1][0];
    expect(lastCall.quantity).toBe(3);
  });

  test("resets quantity to 1 after successful add", () => {
    const onAddSuccess = jest.fn();

    render(<AddToCartInputBtn product={product} onAddSuccess={onAddSuccess} />);

    fireEvent.click(screen.getByTestId("add-to-cart-btn"));

    expect(onAddSuccess).toHaveBeenCalled();
    const lastInputCall =
      mockAddToCartInput.mock.calls[
        mockAddToCartInput.mock.calls.length - 1
      ][0];
    expect(lastInputCall.quantity).toBe(1);
  });
});
