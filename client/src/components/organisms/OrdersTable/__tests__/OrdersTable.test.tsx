import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import OrdersTable from "@/components/organisms/OrdersTable";
import type { Order } from "@/types/order";

import { useAxios } from "@/hooks/useAxios";
import { useAlert } from "@/context/AlertContext";
import { useNavigate } from "react-router";

jest.mock("@/hooks/useAxios", () => ({
  useAxios: jest.fn(),
}));

jest.mock("@/context/AlertContext", () => ({
  useAlert: jest.fn(),
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

jest.mock("@/assets/icons/search.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="search-icon" />,
}));

jest.mock("@/assets/icons/nav-arrow-down.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-down" />,
}));

jest.mock("@/assets/icons/nav-arrow-up.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-up" />,
}));

jest.mock("@/assets/icons/nav-arrow-left.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-left" />,
}));

jest.mock("@/assets/icons/nav-arrow-right.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-right" />,
}));

const renderOrdersTable = () =>
  render(
    <MemoryRouter>
      <OrdersTable isAdmin={true} />
    </MemoryRouter>
  );

const baseOrder: Order = {
  _id: "order-1",
  orderNo: "ORD-1",
  userId: "user-1",
  name: "王小明",
  phone: "0912345678",
  address: "台北市信義區",
  orderItems: [
    {
      _id: "order-item-1",
      productId: "product-1",
      quantity: 1,
      price: 100,
      amount: 100,
      title: "商品 1",
    },
  ],
  subtotal: 100,
  shippingFee: 0,
  totalAmount: 100,
  status: "paid" as Order["status"],
  paymentStatus: "paid" as Order["paymentStatus"],
  shippingStatus: "pending" as Order["shippingStatus"],
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

describe("OrdersTable", () => {
  const refreshMock = jest.fn();
  const showAlertMock = jest.fn();
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAlert as jest.Mock).mockReturnValue({ showAlert: showAlertMock });
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
  });

  test("renders empty state when no orders", () => {
    (useAxios as jest.Mock).mockReturnValue({
      data: { orders: [], totalOrders: 0, totalPages: 1 },
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      refresh: refreshMock,
    });

    renderOrdersTable();

    expect(refreshMock).toHaveBeenCalled();
    expect(screen.getByText("尚無訂單資訊...")).toBeInTheDocument();
  });

  test("displays admin columns and actions", () => {
    (useAxios as jest.Mock).mockReturnValue({
      data: { orders: [baseOrder], totalOrders: 1, totalPages: 1 },
      error: null,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refresh: refreshMock,
    });

    renderOrdersTable();

    expect(screen.getByText("ORD-1")).toBeInTheDocument();
    expect(screen.getByText("會員編號")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "出貨" })).toBeInTheDocument();
  });

  test("navigates to checkout for unpaid user order", () => {
    const unpaidOrder: Order = {
      ...baseOrder,
      _id: "order-2",
      orderNo: "ORD-2",
      status: "processing" as Order["status"],
      paymentStatus: "unpaid" as Order["paymentStatus"],
    };

    (useAxios as jest.Mock).mockReturnValue({
      data: { orders: [unpaidOrder], totalOrders: 1, totalPages: 1 },
      error: null,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refresh: refreshMock,
    });

    render(
      <MemoryRouter>
        <OrdersTable isAdmin={false} />
      </MemoryRouter>
    );

    const repayButton = screen.getByRole("button", { name: "重新付款" });
    fireEvent.click(repayButton);

    expect(navigateMock).toHaveBeenCalledWith("/checkout/order-2");
  });
});
