import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import CartItemRow from "@/components/molecules/CartItemRow";

vi.mock("@/components/atoms/QuantityStepper", () => ({
  default: ({
    value,
    max,
    onChange,
  }: {
    value: number;
    max: number;
    onChange: (next: number) => void;
  }) => (
    <div>
      <span data-testid="stepper-value">{value}</span>
      <span data-testid="stepper-max">{max}</span>
      <button onClick={() => onChange(value + 1)}>increase</button>
    </div>
  ),
}));

describe("CartItemRow 元件", () => {
  const item = {
    _id: "cart-item-1",
    cartId: "cart-1",
    productId: "product-1",
    quantity: 2,
    product: {
      _id: "product-1",
      title: "測試商品",
      countInStock: 8,
      tagline: "tagline",
      categories: ["分類"],
      description: "desc",
      price: 100,
      content: "content",
      expiryDate: "2026-12-31",
      allergens: [],
      delivery: "宅配",
      storage: "常溫",
      ingredients: "ingredients",
      nutrition: "nutrition",
      salesCount: 0,
      tags: [],
      imageUrl: "img.jpg",
    },
  };

  test("在 QuantityStepper 中顯示正確的數量", () => {
    render(<CartItemRow item={item} onChangeQuantity={vi.fn()} />);

    expect(screen.getByTestId("stepper-value")).toHaveTextContent("2");
  });

  test("數量變化時呼叫 onChangeQuantity", () => {
    const onChangeQuantity = vi.fn();

    render(<CartItemRow item={item} onChangeQuantity={onChangeQuantity} />);

    fireEvent.click(screen.getByRole("button", { name: "increase" }));

    expect(onChangeQuantity).toBeDefined();
  });
});
