import {
  preventInvalidInput,
  handleQuantityChange,
  handleAddToCart,
  handleRemoveFromCart,
  calculateFreeShipping,
} from "@/utils/cartUtils";

describe("preventInvalidInput function", () => {
  test("prevents invalid keys", () => {
    // 使用無效鍵 "."，確認 preventDefault 沒有被呼叫。
    const e: Pick<
      React.KeyboardEvent<HTMLInputElement>,
      "key" | "preventDefault"
    > = {
      key: ".",
      preventDefault: jest.fn(),
    };

    preventInvalidInput(e as unknown as React.KeyboardEvent<HTMLInputElement>);

    expect(e.preventDefault).toHaveBeenCalled();
  });
});

describe("handleQuantityChange function", () => {
  test("updates quantity correctly", () => {
    const setQuantity = jest.fn();
    const product = { _id: "1", countInStock: 10 };

    handleQuantityChange(5, product, setQuantity);
    expect(setQuantity).toHaveBeenCalledWith(5);
  });

  test("does not allow negative quantity", () => {
    const setQuantity = jest.fn();
    const product = { _id: "1", countInStock: 10 };
    // 嘗試設為負數，應該不允許且被設置為 1。
    handleQuantityChange(-5, product, setQuantity);
    expect(setQuantity).toHaveBeenCalledWith(1);
  });
});

describe("handleAddToCart function", () => {
  test("adds product to cart", async () => {
    const addToCart = jest.fn().mockResolvedValue({});
    const setQuantity = jest.fn();
    const product = { _id: "1", countInStock: 10 };
    // 嘗試將一件商品加入購物車，並確認 addToCart 是否正確被呼叫，並傳遞商品 ID 及數量。
    await handleAddToCart(product, 1, addToCart, setQuantity);
    expect(addToCart).toHaveBeenCalledWith({ productId: "1", quantity: 1 });
  });

  test("does nothing if product is null", async () => {
    const addToCart = jest.fn();
    const setQuantity = jest.fn();
    // 嘗試將 null 加入購物車，並確認 addToCart 沒有被呼叫。
    await handleAddToCart(null, 1, addToCart, setQuantity);
    expect(addToCart).not.toHaveBeenCalled();
  });
});

describe("handleRemoveFromCart function", () => {
  test("removes product from cart", async () => {
    const removeFromCart = jest.fn().mockResolvedValue({});
    // 嘗試從購物車中移除商品，並確認 removeFromCart 是否正確被呼叫，並傳遞商品 ID。
    await handleRemoveFromCart("1", removeFromCart);
    expect(removeFromCart).toHaveBeenCalledWith("1");
  });
});

describe("calculateFreeShipping function", () => {
  test("calculates free shipping correctly", () => {
    const result = calculateFreeShipping(600);
    // 確認當消費金額超過一定數額（例如 600），應該享有免運，並確認運費為 0。
    expect(result.isFreeShipping).toBe(true);
    expect(result.shippingFee).toBe(0);
  });
});
