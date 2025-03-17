import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useCart, CartContext, CartProvider } from "@/context/CartContext";
import { CartReducer } from "@/context/CartContext";
import * as AuthContextModule from "@/context/AuthContext";
import * as useAxiosModule from "@/hooks/useAxios";

jest.mock("@/hooks/useAxios", () => ({ useAxios: jest.fn() }));
jest.mock("@/context/AuthContext", () => ({
  ...jest.requireActual("@/context/AuthContext"),
  useAuth: jest.fn(),
}));

// 創建一個模擬的 localStorage 物件
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => (store[key] = value.toString())),
    removeItem: jest.fn((key) => delete store[key]),
    clear: jest.fn(() => (store = {})),
  };
})();
// 將模擬的 localStorage 注入到 window 物件中
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const TestComponent = () => {
  const {
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    totalQuantity,
    cart,
    subtotal,
    isLoading,
    error,
  } = useCart();

  return (
    <div>
      <button onClick={() => addToCart({ productId: "1", quantity: 1 })}>
        Add to Cart
      </button>
      <button onClick={() => removeFromCart("cart-item-1")}>
        Remove from Cart
      </button>
      <button onClick={() => changeQuantity("cart-item-1", 2)}>
        Change Quantity
      </button>
      <button onClick={clearCart}>Clear Cart</button>
      <div>Total Quantity: {totalQuantity}</div>
      <div>Cart Items: {cart.length}</div>
      <div>Subtotal: {subtotal}</div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

describe("CartReducer", () => {
  test("handles different actions", () => {
    // 測試設定 loading 時的 state
    let state = { cart: [], isLoading: false, error: null };
    state = CartReducer(state, { type: "SET_IS_LOADING", payload: true });
    expect(state.isLoading).toBe(true);

    // 測試設置購物車內容
    const cartItems = [{ cartItemId: "1", productId: "1", quantity: 1 }];
    state = CartReducer(state, {
      type: "SET_CART_SUCCESS",
      payload: cartItems,
    });
    expect(state.cart).toEqual(cartItems);
    expect(state.error).toBeNull();

    // 測試移除商品
    state.cart = [
      { cartItemId: "1", productId: "1", quantity: 1 },
      { cartItemId: "2", productId: "2", quantity: 2 },
    ];
    state = CartReducer(state, { type: "REMOVE_ITEM_SUCCESS", payload: "1" });
    expect(state.cart.length).toBe(1);
    expect(state.cart[0].cartItemId).toBe("2");

    // 測試更新商品數量
    state.cart = [
      { cartItemId: "1", productId: "1", quantity: 1 },
      { cartItemId: "2", productId: "2", quantity: 2 },
    ];
    state = CartReducer(state, {
      type: "UPDATE_QUANTITY_SUCCESS",
      cartItemId: "1",
      quantity: 3,
    });
    expect(state.cart[0].quantity).toBe(3);

    // 測試清空購物車
    state = CartReducer(state, { type: "CLEAR_CART_SUCCESS" });
    expect(state.cart).toEqual([]);

    // 測試設定錯誤狀態
    state = CartReducer(state, { type: "SET_FAIL", payload: "錯誤訊息" });
    expect(state.error).toBe("錯誤訊息");
  });
});

describe("CartContext.Provider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    // 模擬未登入的狀態
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    const mockRefresh = jest.fn().mockResolvedValue({ cart: [] });
    (useAxiosModule.useAxios as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      loading: false,
      refresh: mockRefresh,
    });
  });

  test("uses local cart when not logged in", async () => {
    // 模擬本地購物車
    const mockCart = [{ productId: "1", quantity: 1 }];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));

    const { rerender } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    // 驗證初始狀態
    expect(screen.getByText("Total Quantity: 1")).toBeInTheDocument();

    // 測試新增商品，並確認商品 quantity 更新為 2。
    fireEvent.click(screen.getByText("Add to Cart"));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([{ productId: "1", quantity: 2 }]),
    );

    localStorageMock.getItem.mockReturnValue(
      JSON.stringify([{ productId: "1", quantity: 2 }]),
    );

    rerender(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );

    // 確認畫面顯示的商品總數量為 2
    await waitFor(() =>
      expect(screen.getByText("Total Quantity: 2")).toBeInTheDocument(),
    );
  });
});

describe("CartContext Consumer", () => {
  test("tests cart functionality", () => {
    const mockContextValue = {
      cart: [],
      isLoading: false,
      error: null,
      totalQuantity: 0,
      subtotal: 0,
      getCart: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      changeQuantity: jest.fn(),
      clearCart: jest.fn(),
      dispatch: jest.fn(),
    };

    const { rerender } = render(
      <CartContext.Provider value={mockContextValue}>
        <TestComponent />
      </CartContext.Provider>,
    );

    // 測試新增商品
    const addBtn = screen.getByText("Add to Cart");
    fireEvent.click(addBtn);
    expect(mockContextValue.addToCart).toHaveBeenCalledWith({
      productId: "1",
      quantity: 1,
    });

    const updatedValue = {
      ...mockContextValue,
      cart: [{ cartItemId: "cart-item-1", productId: "1", quantity: 1 }],
      totalQuantity: 1,
    };

    rerender(
      <CartContext.Provider value={updatedValue}>
        <TestComponent />
      </CartContext.Provider>,
    );
    expect(screen.getByText("Total Quantity: 1")).toBeInTheDocument();

    // 測試移除商品
    fireEvent.click(screen.getByText("Remove from Cart"));
    expect(mockContextValue.removeFromCart).toHaveBeenCalledWith("cart-item-1");

    // 測試更改數量
    fireEvent.click(screen.getByText("Change Quantity"));
    expect(mockContextValue.changeQuantity).toHaveBeenCalledWith(
      "cart-item-1",
      2,
    );

    // 測試清空購物車
    fireEvent.click(screen.getByText("Clear Cart"));
    expect(mockContextValue.clearCart).toHaveBeenCalled();
  });

  test("subtotal updates correctly", () => {
    // 模擬購物車內容，包含商品價格資訊。
    const mockContextValue = {
      cart: [
        {
          cartItemId: "cart-item-1",
          productId: "1",
          quantity: 2,
          product: {
            title: "測試商品1",
            price: 100,
            imageUrl: "test.jpg",
            countInStock: 10,
          },
        },
        {
          cartItemId: "cart-item-2",
          productId: "2",
          quantity: 1,
          product: {
            title: "測試商品2",
            price: 200,
            imageUrl: "test2.jpg",
            countInStock: 5,
          },
        },
      ],
      isLoading: false,
      error: null,
      totalQuantity: 3,
      subtotal: 400, // 2 * 100 + 1 * 200 = 400
      getCart: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      changeQuantity: jest.fn(),
      clearCart: jest.fn(),
      dispatch: jest.fn(),
    };

    render(
      <CartContext.Provider value={mockContextValue}>
        <TestComponent />
      </CartContext.Provider>,
    );

    expect(screen.getByText("Subtotal: 400")).toBeInTheDocument();
    const updatedValue = {
      ...mockContextValue,
      cart: [
        {
          cartItemId: "cart-item-1",
          productId: "1",
          quantity: 3, // 數量從 2 改為 3
          product: {
            title: "測試商品1",
            price: 100,
            imageUrl: "test.jpg",
            countInStock: 10,
          },
        },
        {
          cartItemId: "cart-item-2",
          productId: "2",
          quantity: 1,
          product: {
            title: "測試商品2",
            price: 200,
            imageUrl: "test2.jpg",
            countInStock: 5,
          },
        },
      ],
      totalQuantity: 4,
      subtotal: 500, // 3 * 100 + 1 * 200 = 500
    };

    render(
      <CartContext.Provider value={updatedValue}>
        <TestComponent />
      </CartContext.Provider>,
    );

    // 確認更新後的小計
    expect(screen.getByText("Subtotal: 500")).toBeInTheDocument();
  });

  test("subtotal is zero when cart is empty", () => {
    const mockContextValue = {
      cart: [],
      isLoading: false,
      error: null,
      totalQuantity: 0,
      subtotal: 0,
      getCart: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      changeQuantity: jest.fn(),
      clearCart: jest.fn(),
      dispatch: jest.fn(),
    };

    render(
      <CartContext.Provider value={mockContextValue}>
        <TestComponent />
      </CartContext.Provider>,
    );

    // 確認空購物車的小計為 0
    expect(screen.getByText("Subtotal: 0")).toBeInTheDocument();
  });
});
