import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";

import ProductSlider from "@/components/organisms/ProductSlider";
import { useGetProductsQuery } from "@/store/slices/apiSlice";
import type { Product } from "@/types";

vi.mock("@/store/slices/apiSlice");

vi.mock("swiper/modules", () => ({
  Autoplay: {},
}));

vi.mock("swiper/react", () => ({
  Swiper: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

vi.mock("@/components/atoms/ProductSliderSkeleton", () => ({
  default: () => <div data-testid="product-slider-skeleton" />,
}));

vi.mock("@/components/atoms/ProductLinkImg", () => ({
  default: ({ product }: { product: Product }) => (
    <img alt={product.title} data-testid="product-image" />
  ),
}));

vi.mock("@/components/molecules/ProductActionForm", () => ({
  default: () => <div data-testid="product-action-form" />,
}));

vi.mock("@/components/atoms/Button", () => ({
  default: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

const mockUseGetProductsQuery = vi.mocked(useGetProductsQuery);

const makeProduct = (overrides?: Partial<Product>): Product => ({
  _id: overrides?._id ?? "product-1",
  title: overrides?.title ?? "草莓蛋糕",
  tagline: overrides?.tagline ?? "tagline",
  categories: overrides?.categories ?? ["蛋糕"],
  description: overrides?.description ?? "描述",
  price: overrides?.price ?? 120,
  content: overrides?.content ?? "content",
  expiryDate: overrides?.expiryDate ?? "3 days",
  allergens: overrides?.allergens ?? ["蛋"],
  delivery: overrides?.delivery ?? "冷藏",
  storage: overrides?.storage ?? "冷藏",
  ingredients: overrides?.ingredients ?? "ingredients",
  nutrition: overrides?.nutrition ?? "nutrition",
  countInStock: overrides?.countInStock ?? 10,
  salesCount: overrides?.salesCount ?? 0,
  tags: overrides?.tags ?? ["推薦"],
  imageUrl: overrides?.imageUrl ?? "cake.jpg",
});

const renderSlider = () =>
  render(
    <MemoryRouter>
      <ProductSlider />
    </MemoryRouter>
  );

describe("ProductSlider 元件", () => {
  test("載入中時顯示 skeleton", () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
    } as never);

    renderSlider();

    expect(screen.getByTestId("product-slider-skeleton")).toBeInTheDocument();
  });

  test("發生錯誤時可點擊重新載入", () => {
    const refetch = vi.fn();
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 500 },
      refetch,
      isFetching: false,
    } as never);

    renderSlider();

    expect(
      screen.getByText("抱歉，暫時無法取得商品資訊。")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "重新載入" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test("沒有資料時顯示空狀態文案", () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
    } as never);

    renderSlider();

    expect(screen.getByText("目前沒有任何推薦的商品")).toBeInTheDocument();
  });

  test("只顯示有庫存商品", () => {
    mockUseGetProductsQuery.mockReturnValue({
      data: {
        products: [
          makeProduct({ _id: "in-stock", title: "有庫存", countInStock: 5 }),
          makeProduct({ _id: "out-stock", title: "無庫存", countInStock: 0 }),
        ],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
    } as never);

    renderSlider();

    expect(screen.getByText("有庫存")).toBeInTheDocument();
    expect(screen.queryByText("無庫存")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("swiper-slide")).toHaveLength(1);
  });
});
