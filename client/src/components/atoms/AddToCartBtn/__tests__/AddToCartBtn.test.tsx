import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import AddToCartBtn from "@/components/atoms/AddToCartBtn";
import { useAlert } from "@/context/AlertContext";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";

vi.mock("@/hooks/useCart");
vi.mock("@/context/AlertContext");

const mockUseCart = vi.mocked(useCart);
const mockUseAlert = vi.mocked(useAlert);

const mockProduct = {
  _id: "product-1",
  title: "測試商品",
  countInStock: 10,
  tagline: "測試商品說明",
  categories: ["測試"],
  description: "測試商品描述",
  price: 100,
  content: "測試內容",
  expiryDate: "2025-12-31",
  allergens: [],
  delivery: "宅配",
  storage: "常溫",
  ingredients: "測試成分",
  nutrition: "測試營養",
  salesCount: 0,
  tags: [],
  imageUrl: "test.jpg",
} as const satisfies Readonly<Product>;

describe("AddToCartBtn 元件", () => {
  const addToCartMock = vi.fn();
  const showAlertMock = vi.fn();
  const hideAlertMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCart.mockReturnValue({
      cart: [],
      addToCart: addToCartMock,
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

    mockUseAlert.mockReturnValue({
      alert: null,
      showAlert: showAlertMock,
      hideAlert: hideAlertMock,
    });
  });

  test("渲染 icon 按鈕並觸發 addToCart", async () => {
    addToCartMock.mockResolvedValue(undefined);

    render(<AddToCartBtn product={mockProduct} />);

    const button = screen.getByRole("button", { name: "加入購物車" });
    fireEvent.click(button);

    await waitFor(() =>
      expect(addToCartMock).toHaveBeenCalledWith("product-1", 1, mockProduct)
    );
  });

  test("渲染 text 按鈕並在新增後顯示「已加入」", async () => {
    addToCartMock.mockResolvedValue(undefined);

    render(<AddToCartBtn btnType="text" product={mockProduct} />);

    const button = screen.getByRole("button", { name: "加入購物車" });
    fireEvent.click(button);

    await waitFor(() => expect(button).toHaveTextContent("✔ 已加入"));
  });

  test("顯示「補貨中」狀態並 disabled 按鈕", () => {
    render(
      <AddToCartBtn
        btnType="text"
        product={{
          _id: "product-2",
          title: "缺貨商品",
          countInStock: 0,
        }}
      />
    );

    const button = screen.getByRole("button", { name: "加入購物車" });
    expect(button).toHaveTextContent("補貨中");
    expect(button).toBeDisabled();
  });

  test("數量超過可用庫存時顯示 Alert", () => {
    mockUseCart.mockReturnValue({
      cart: [
        {
          _id: "item-1",
          cartId: "cart-1",
          productId: "product-1",
          quantity: 3,
          product: mockProduct,
        },
      ],
      addToCart: addToCartMock,
      isLoading: false,
      error: "",
      totalQuantity: 3,
      subtotal: 597,
      shippingInfo: {
        isFreeShipping: true,
        shippingFee: 0,
        message: "已達 NT$500 最低免運門檻！",
        threshold: 500,
        progress: 100,
      },
      removeFromCart: vi.fn(),
      changeQuantity: vi.fn(),
      clearCart: vi.fn(),
      refetchCart: vi.fn(),
    } satisfies ReturnType<typeof useCart>);

    render(<AddToCartBtn btnType="text" product={mockProduct} quantity={8} />);

    fireEvent.click(screen.getByRole("button", { name: "加入購物車" }));

    expect(addToCartMock).not.toHaveBeenCalled();
    expect(showAlertMock).toHaveBeenCalledWith({
      variant: "warning",
      message:
        "無法將所選數量加到購物車。因為購物車已有 3 件商品，請至購物車頁面查看。",
    });
  });

  test("addToCart 失敗時顯示 Alert", async () => {
    addToCartMock.mockRejectedValue(new Error("加入失敗"));

    render(<AddToCartBtn product={mockProduct} />);

    fireEvent.click(screen.getByRole("button", { name: "加入購物車" }));

    await waitFor(() =>
      expect(showAlertMock).toHaveBeenCalledWith({
        variant: "error",
        message: "加入失敗",
      })
    );
  });
});
