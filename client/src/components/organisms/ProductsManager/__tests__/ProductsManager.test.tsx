import { render, screen } from "@testing-library/react";
import ProductsManager from "@/components/organisms/ProductsManager";
import type { Product } from "@/types/product";
import { useAxios } from "@/hooks/useAxios";
import { useAlert } from "@/context/AlertContext";

jest.mock("@/hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("@/context/AlertContext", () => ({
  useAlert: jest.fn(),
}));

jest.mock("@/components/organisms/ProductsManager/Form", () => {
  const MockProductForm: React.FC = () => <div data-testid="product-form" />;
  MockProductForm.displayName = "MockProductForm";
  return MockProductForm;
});

type ModalMockProps = { id: string; children?: React.ReactNode };

jest.mock("@/components/molecules/Modal", () => {
  const MockModal: React.FC<ModalMockProps> = (props) => (
    <div data-testid={`modal-${props.id}`}>{props.children}</div>
  );
  MockModal.displayName = "MockModal";
  return MockModal;
});

jest.mock("@/assets/icons/edit.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="edit-icon" />,
}));

jest.mock("@/assets/icons/xmark.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="close-icon" />,
}));

const mockUseAxios = useAxios as jest.Mock;

const setupAxiosMocks = () => {
  const addProduct = jest.fn();
  const updateProduct = jest.fn();
  const deleteProduct = jest.fn();
  const refreshProduct = jest.fn();

  mockUseAxios
    .mockReturnValueOnce({ refresh: addProduct })
    .mockReturnValueOnce({ refresh: updateProduct })
    .mockReturnValueOnce({ refresh: deleteProduct })
    .mockReturnValueOnce({ refresh: refreshProduct });

  return { addProduct, updateProduct, deleteProduct, refreshProduct };
};

const baseProduct: Product = {
  _id: "prod-1",
  title: "有機果汁",
  tagline: "天然健康",
  categories: ["飲品"],
  description: "純天然果汁",
  price: 150,
  content: "詳細資訊",
  expiryDate: "2025-12-31",
  allergens: [],
  delivery: "宅配",
  storage: "冷藏",
  ingredients: "水果",
  nutrition: "營養成份",
  countInStock: 10,
  salesCount: 100,
  tags: ["熱銷"],
  imageUrl: "image.jpg",
};

describe("ProductsManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAxios.mockReset();
    (useAlert as jest.Mock).mockReturnValue({ showAlert: jest.fn() });
  });

  test("renders empty state when no products available", () => {
    setupAxiosMocks();

    render(<ProductsManager products={[]} refreshProducts={jest.fn()} />);

    expect(screen.getByText("尚無任何商品...")).toBeInTheDocument();
  });

  test("renders product list items", () => {
    setupAxiosMocks();

    render(
      <ProductsManager products={[baseProduct]} refreshProducts={jest.fn()} />
    );

    expect(screen.getByText("商品管理")).toBeInTheDocument();
    expect(screen.getByText("有機果汁")).toBeInTheDocument();
  });
});
