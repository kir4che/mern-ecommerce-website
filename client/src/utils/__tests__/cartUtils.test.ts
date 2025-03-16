import {
  preventInvalidInput,
  handleQuantityChange,
  handleAddToCart,
  handleRemoveFromCart,
  calculateFreeShipping,
} from "@/utils/cartUtils";

describe("preventInvalidInput", () => {
  test("prevents invalid keys", () => {
    const e = { key: ".", preventDefault: jest.fn() } as any;
    preventInvalidInput(e);
    expect(e.preventDefault).toHaveBeenCalled();
  });
});

describe("handleQuantityChange", () => {
  test("updates quantity correctly", () => {
    const setQuantity = jest.fn();
    const product = { _id: "1", countInStock: 10 };
    handleQuantityChange(5, product, setQuantity);
    expect(setQuantity).toHaveBeenCalledWith(5);
  });
});

describe("handleAddToCart", () => {
  test("adds product to cart", async () => {
    const addToCart = jest.fn().mockResolvedValue({});
    const setQuantity = jest.fn();
    const product = { _id: "1", countInStock: 10 };
    await handleAddToCart(product, 1, addToCart, setQuantity);
    expect(addToCart).toHaveBeenCalledWith({ productId: "1", quantity: 1 });
  });
});

describe("handleRemoveFromCart", () => {
  test("removes product from cart", async () => {
    const removeFromCart = jest.fn().mockResolvedValue({});
    await handleRemoveFromCart("1", removeFromCart);
    expect(removeFromCart).toHaveBeenCalledWith("1");
  });
});

describe("calculateFreeShipping", () => {
  test("calculates free shipping correctly", () => {
    const result = calculateFreeShipping(600);
    expect(result.isFreeShipping).toBe(true);
    expect(result.shippingFee).toBe(0);
  });
});
