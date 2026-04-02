import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import ProductActionForm from "@/components/molecules/ProductActionForm";
import { useCart } from "@/hooks/useCart";

vi.mock("@/hooks/useCart");

vi.mock("@/components/atoms/QuantityStepper", () => ({
  default: ({
    value,
    variant,
    size,
    disabled,
    onChange,
  }: {
    value: number;
    variant?: string;
    size?: string;
    disabled?: boolean;
    onChange: (next: number) => void;
  }) => (
    <div>
      <div data-testid="stepper-value">{value}</div>
      <div data-testid="stepper-variant">{variant || "buttons"}</div>
      <div data-testid="stepper-size">{size || "md"}</div>
      <div data-testid="stepper-disabled">{String(!!disabled)}</div>
      <button onClick={() => onChange(value + 1)}>stepper-increase</button>
    </div>
  ),
}));

vi.mock("@/components/atoms/AddToCartBtn", () => ({
  default: ({
    btnType,
    quantity,
    onAddSuccess,
  }: {
    btnType?: string;
    quantity?: number;
    onAddSuccess?: () => void;
  }) => (
    <div>
      <div data-testid="add-btn-type">{btnType || "icon"}</div>
      <div data-testid="add-btn-quantity">{quantity || 1}</div>
      <button onClick={() => onAddSuccess?.()}>add-success</button>
    </div>
  ),
}));

const mockUseCart = vi.mocked(useCart);

const product = {
  _id: "product-1",
  title: "蛋糕",
  tagline: "tagline",
  categories: ["甜點"],
  description: "desc",
  price: 120,
  content: "content",
  expiryDate: "2026-12-31",
  allergens: [],
  delivery: "宅配",
  storage: "冷藏",
  ingredients: "ingredients",
  nutrition: "nutrition",
  countInStock: 5,
  salesCount: 0,
  tags: [],
  imageUrl: "img.jpg",
};

describe("ProductActionForm 元件", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCart.mockReturnValue({
      cart: [],
      addToCart: vi.fn(),
      isLoading: false,
      error: "",
      totalQuantity: 0,
      subtotal: 0,
      shippingInfo: {
        isFreeShipping: false,
        shippingFee: 60,
        message: "",
        threshold: 500,
        progress: 0,
      },
      removeFromCart: vi.fn(),
      changeQuantity: vi.fn(),
      clearCart: vi.fn(),
      refetchCart: vi.fn(),
    } satisfies ReturnType<typeof useCart>);
  });

  test("新增成功後將數量重置為 1", () => {
    render(<ProductActionForm product={product} variant="card" />);

    fireEvent.click(screen.getByRole("button", { name: "stepper-increase" }));
    expect(screen.getByTestId("stepper-value")).toHaveTextContent("2");

    fireEvent.click(screen.getByRole("button", { name: "add-success" }));
    expect(screen.getByTestId("stepper-value")).toHaveTextContent("1");
  });

  test("可用庫存為 0 時顯示購買上限訊息", () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          productId: "product-1",
          quantity: 5,
          _id: "mock-id",
          cartId: "mock-cart",
          product,
        },
      ],
      addToCart: vi.fn(),
      isLoading: false,
      error: "",
      totalQuantity: 0,
      subtotal: 0,
      shippingInfo: {
        isFreeShipping: false,
        shippingFee: 60,
        message: "",
        threshold: 500,
        progress: 0,
      },
      removeFromCart: vi.fn(),
      changeQuantity: vi.fn(),
      clearCart: vi.fn(),
      refetchCart: vi.fn(),
    });

    render(<ProductActionForm product={product} variant="detail" />);

    expect(screen.getByText("已達購買上限")).toBeInTheDocument();
    expect(screen.getByTestId("stepper-disabled")).toHaveTextContent("true");
  });
});
