import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProductSlider from "@/components/organisms/ProductSlider";
import type { Product } from "@/types/product";
import { useAxios } from "@/hooks/useAxios";

jest.mock("@/hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("@/utils/linkToCategory", () => ({
  linkToCategory: new Proxy(
    {},
    {
      get: () => "category",
    }
  ),
}));

jest.mock("@/components/molecules/AddToCartInputBtn", () =>
  jest.fn(({ product }) => (
    <div data-testid={`add-to-cart-${product._id}`}>add</div>
  ))
);

jest.mock("@/components/atoms/ProductLinkImg", () =>
  jest.fn(({ product }) => (
    <img data-testid={`product-image-${product._id}`} alt={product.title} />
  ))
);

jest.mock("@/assets/icons/refresh.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="refresh-icon" />,
}));

const mockUseAxios = useAxios as jest.Mock;

const createProduct = (overrides?: Partial<Product>): Product => ({
  _id: overrides?._id ?? "product-1",
  title: overrides?.title ?? "推薦商品",
  tagline: overrides?.tagline ?? "好吃",
  categories: overrides?.categories ?? ["熱銷"],
  description: overrides?.description ?? "美味可口",
  price: overrides?.price ?? 199,
  content: overrides?.content ?? "詳細介紹",
  expiryDate: overrides?.expiryDate ?? "2025-12-31",
  allergens: overrides?.allergens ?? [],
  delivery: overrides?.delivery ?? "宅配",
  storage: overrides?.storage ?? "常溫",
  ingredients: overrides?.ingredients ?? "成分",
  nutrition: overrides?.nutrition ?? "營養標示",
  countInStock: overrides?.countInStock ?? 10,
  salesCount: overrides?.salesCount ?? 5,
  tags: overrides?.tags ?? ["推薦"],
  imageUrl: overrides?.imageUrl ?? "image.jpg",
});

const renderProductSlider = () =>
  render(<ProductSlider />, { wrapper: MemoryRouter });

describe("ProductSlider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxios.mockReset();
  });

  test("renders loading state", () => {
    mockUseAxios.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      refresh: jest.fn(),
    });

    renderProductSlider();

    expect(screen.getByTestId("loading-wrapper")).toBeInTheDocument();
  });

  test("renders error state and retries on click", async () => {
    const refreshMock = jest.fn().mockResolvedValue({ success: true });
    mockUseAxios.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refresh: refreshMock,
    });

    renderProductSlider();

    expect(screen.getByText("抱歉，暫時無法取得商品資訊")).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: "重新載入" });

    fireEvent.click(retryButton);

    await waitFor(() => expect(refreshMock).toHaveBeenCalledTimes(1));
  });

  test("shows empty recommended message when no tagged products", () => {
    mockUseAxios.mockReturnValue({
      data: {
        products: [createProduct({ _id: "p-1", tags: ["熱銷"] })],
      },
      isLoading: false,
      isError: false,
      refresh: jest.fn(),
    });

    renderProductSlider();

    expect(screen.getByText("目前沒有推薦商品")).toBeInTheDocument();
  });

  test("renders recommended products inside swiper", () => {
    const products = [
      createProduct({ _id: "p-1", title: "商品 A" }),
      createProduct({ _id: "p-2", title: "商品 B" }),
    ];

    mockUseAxios.mockReturnValue({
      data: { products },
      isLoading: false,
      isError: false,
      refresh: jest.fn(),
    });

    renderProductSlider();

    expect(screen.getByTestId("swiper")).toBeInTheDocument();
    expect(screen.getAllByTestId("swiper-slide")).toHaveLength(2);
    expect(screen.getByText("商品 A")).toBeInTheDocument();
    expect(screen.getByText("商品 B")).toBeInTheDocument();
  });
});
