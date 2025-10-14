import { render, screen, fireEvent, act } from "@testing-library/react";
import QuantityInput from "@/components/molecules/QuantityInput";
import type { CartItem } from "@/types/cart";

import { useCart } from "@/hooks/useCart";

jest.mock("@/hooks/useCart", () => ({
  useCart: jest.fn(),
}));

jest.mock("@/assets/icons/plus.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="plus-icon" />,
}));

jest.mock("@/assets/icons/minus.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="minus-icon" />,
}));

const changeQuantityMock = jest.fn();

const baseItem: CartItem = {
  _id: "cart-item-1",
  cartId: "cart-1",
  productId: "product-1",
  quantity: 2,
  product: {
    _id: "product-1",
    title: "測試商品",
    tagline: "tagline",
    categories: ["category"],
    description: "desc",
    price: 100,
    content: "content",
    expiryDate: "2025-12-31",
    allergens: [],
    delivery: "宅配",
    storage: "常溫",
    ingredients: "ingredients",
    nutrition: "nutrition",
    countInStock: 5,
    salesCount: 10,
    tags: ["tag"],
    imageUrl: "image.jpg",
  },
};

const setup = (override?: Partial<CartItem>) => {
  (useCart as jest.Mock).mockReturnValue({
    changeQuantity: changeQuantityMock,
  });

  const item: CartItem = {
    ...baseItem,
    ...override,
    product: {
      ...baseItem.product,
      ...(override?.product ?? {}),
    },
  };

  return render(<QuantityInput item={item} />);
};

describe("QuantityInput", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("increments quantity and triggers changeQuantity after debounce", () => {
    setup();

    const buttons = screen.getAllByRole("button");
    const incrementButton = buttons[1];

    fireEvent.click(incrementButton);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(changeQuantityMock).toHaveBeenCalledWith("cart-item-1", 3);

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("3");
  });

  test("clamps manual input to available stock", () => {
    setup();

    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "10" } });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(input.value).toBe("5");
    expect(changeQuantityMock).toHaveBeenCalledWith("cart-item-1", 5);
  });

  test("disables decrement below 1 and increment at stock limit", () => {
    setup({
      quantity: 1,
      product: { ...baseItem.product, countInStock: 1 },
    });

    const [decrementButton, incrementButton] = screen.getAllByRole("button");

    expect(decrementButton).toBeDisabled();
    expect(incrementButton).toBeDisabled();
  });
});
