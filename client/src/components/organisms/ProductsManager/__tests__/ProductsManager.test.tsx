import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import ProductsManager from "@/components/organisms/ProductsManager";
import { useAlert } from "@/context/AlertContext";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/store/slices/apiSlice";
import type { Product } from "@/types";

vi.mock("@/context/AlertContext");
vi.mock("@/store/slices/apiSlice");

vi.mock("@/components/atoms/BlurImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("@/components/atoms/Button", () => ({
  default: ({
    children,
    onClick,
    disabled,
    ariaLabel,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {ariaLabel ?? children}
    </button>
  ),
}));

vi.mock("@/components/atoms/Select", () => ({
  default: ({
    name,
    value,
    options,
    onChange,
  }: {
    name: string;
    value?: string;
    options: Array<{ label: string; value: string }>;
    onChange?: (name: string, value: string) => void;
  }) => (
    <select
      data-testid={name}
      value={value ?? ""}
      onChange={(e) => onChange?.(name, e.target.value)}
    >
      <option value="">全部</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("@/components/molecules/ManagerHeader", () => ({
  default: ({
    searchValue,
    onSearchChange,
    children,
  }: {
    searchValue: string;
    onSearchChange: (value: string) => void;
    children?: React.ReactNode;
  }) => (
    <div>
      <input
        placeholder="搜尋名稱或標籤"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {children}
    </div>
  ),
}));

interface ManagerTableMockProps {
  data: Product[];
  onSort?: (key: string, order: "asc" | "desc") => void;
  onSelectRow?: (id: string, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

vi.mock("@/components/molecules/ManagerTable", () => ({
  default: ({
    data,
    onSort,
    onSelectRow,
    onSelectAll,
  }: ManagerTableMockProps) => (
    <div>
      <button type="button" onClick={() => onSort?.("price", "desc")}>
        排序價格降冪
      </button>
      <button
        type="button"
        onClick={() => {
          const first = data[0];
          if (first) onSelectRow?.(first._id, true);
        }}
      >
        選第一筆
      </button>
      <button type="button" onClick={() => onSelectAll?.(true)}>
        全選
      </button>
      <ul>
        {data.map((product) => (
          <li key={product._id} data-testid="product-row">
            {product.title}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

vi.mock("@/components/molecules/Modal", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="modal">{children}</div>
  ),
}));

vi.mock("@/components/organisms/ProductsManager/ProductsManagerForm", () => ({
  default: () => <form data-testid="product-form" />,
}));

vi.mock("@/components/molecules/BatchActionBar", () => ({
  default: ({
    selectedCount,
    onDeleteClick,
  }: {
    selectedCount: number;
    onDeleteClick: () => void;
  }) => (
    <div>
      <span data-testid="selected-count">{selectedCount}</span>
      <button type="button" onClick={onDeleteClick}>
        批量刪除
      </button>
    </div>
  ),
}));

const mockUseAlert = vi.mocked(useAlert);
const mockUseCreateProductMutation = vi.mocked(useCreateProductMutation);
const mockUseUpdateProductMutation = vi.mocked(useUpdateProductMutation);
const mockUseDeleteProductMutation = vi.mocked(useDeleteProductMutation);
const mockUseGetProductByIdQuery = vi.mocked(useGetProductByIdQuery);

const makeProduct = (overrides?: Partial<Product>): Product => ({
  _id: overrides?._id ?? "product-1",
  title: overrides?.title ?? "草莓蛋糕",
  tagline: overrides?.tagline ?? "tagline",
  categories: overrides?.categories ?? ["蛋糕"],
  description: overrides?.description ?? "描述",
  price: overrides?.price ?? 100,
  content: overrides?.content ?? "content",
  expiryDate: overrides?.expiryDate ?? "3 days",
  allergens: overrides?.allergens ?? ["蛋"],
  delivery: overrides?.delivery ?? "冷藏",
  storage: overrides?.storage ?? "冷藏",
  ingredients: overrides?.ingredients ?? "ingredients",
  nutrition: overrides?.nutrition ?? "nutrition",
  countInStock: overrides?.countInStock ?? 50,
  salesCount: overrides?.salesCount ?? 0,
  tags: overrides?.tags ?? ["推薦"],
  imageUrl: overrides?.imageUrl ?? "cake.jpg",
});

describe("ProductsManager 元件", () => {
  const showAlert = vi.fn();
  const addProduct = vi.fn();
  const updateProduct = vi.fn();
  const deleteProduct = vi.fn();

  const products: Product[] = [
    makeProduct({
      _id: "p-1",
      title: "蘋果派",
      categories: ["派類"],
      price: 150,
      countInStock: 10,
    }),
    makeProduct({
      _id: "p-2",
      title: "巧克力蛋糕",
      categories: ["蛋糕"],
      price: 300,
      countInStock: 0,
    }),
    makeProduct({
      _id: "p-3",
      title: "原味吐司",
      categories: ["麵包"],
      price: 80,
      countInStock: 40,
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAlert.mockReturnValue({
      alert: null,
      showAlert,
      hideAlert: vi.fn(),
    } satisfies ReturnType<typeof useAlert>);

    addProduct.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });
    updateProduct.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });
    deleteProduct.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({}) });

    mockUseCreateProductMutation.mockReturnValue([
      addProduct,
      { isLoading: false, reset: vi.fn() },
    ] as never);
    mockUseUpdateProductMutation.mockReturnValue([
      updateProduct,
      { isLoading: false, reset: vi.fn() },
    ] as never);
    mockUseDeleteProductMutation.mockReturnValue([
      deleteProduct,
      { isLoading: false, reset: vi.fn() },
    ] as never);
    mockUseGetProductByIdQuery.mockReturnValue({ refetch: vi.fn() } as never);

    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
  });

  test("可用分類與庫存條件篩選商品", () => {
    render(<ProductsManager products={products} />);

    fireEvent.change(screen.getByTestId("products-category-filter"), {
      target: { value: "麵包" },
    });
    fireEvent.change(screen.getByTestId("products-status-filter"), {
      target: { value: "in-stock" },
    });

    expect(screen.getByText("原味吐司")).toBeInTheDocument();
    expect(screen.queryByText("蘋果派")).not.toBeInTheDocument();
    expect(screen.queryByText("巧克力蛋糕")).not.toBeInTheDocument();
  });

  test("可切換為價格降冪排序", () => {
    render(<ProductsManager products={products} />);

    fireEvent.click(screen.getByRole("button", { name: "排序價格降冪" }));

    const rows = screen.getAllByTestId("product-row");
    expect(rows[0]).toHaveTextContent("巧克力蛋糕");
  });

  test("可批量刪除已選商品", async () => {
    render(<ProductsManager products={products} />);

    fireEvent.click(screen.getByRole("button", { name: "全選" }));
    fireEvent.click(screen.getByRole("button", { name: "批量刪除" }));

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith("p-1");
      expect(deleteProduct).toHaveBeenCalledWith("p-2");
      expect(deleteProduct).toHaveBeenCalledWith("p-3");
    });

    expect(showAlert).toHaveBeenCalledWith({
      variant: "success",
      message: "已刪除 3 筆商品",
    });
  });
});
