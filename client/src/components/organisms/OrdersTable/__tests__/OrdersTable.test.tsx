import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { type Mock, vi } from "vitest";

import OrdersTable from "@/components/organisms/OrdersTable";
import type { Order } from "@/types";

import { useAlert } from "@/context/AlertContext";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/store/slices/apiSlice";

vi.mock("@/context/AlertContext");
vi.mock("@/store/slices/apiSlice");
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("@/assets/icons/search.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="search-icon" />,
}));

vi.mock("@/assets/icons/nav-arrow-down.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-down" />,
}));

vi.mock("@/assets/icons/nav-arrow-up.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-up" />,
}));

vi.mock("@/assets/icons/nav-arrow-left.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-left" />,
}));

vi.mock("@/assets/icons/nav-arrow-right.inline.svg", () => ({
  ReactComponent: () => <svg data-testid="arrow-right" />,
}));

const renderOrdersTable = () =>
  render(
    <MemoryRouter>
      <OrdersTable isAdmin={true} />
    </MemoryRouter>
  );

const useGetOrdersQueryMock = vi.mocked(useGetOrdersQuery);
const useUpdateOrderMutationMock = vi.mocked(useUpdateOrderMutation);

const baseOrder: Order = {
  _id: "order-1",
  orderNo: "ORD-1",
  userId: "user-1",
  name: "kir4che",
  phone: "0912345678",
  address: "台北市",
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

describe("OrdersTable 元件", () => {
  const refreshMock = vi.fn();
  const showAlertMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAlert as Mock).mockReturnValue({ showAlert: showAlertMock });
    (useNavigate as Mock).mockReturnValue(navigateMock);
    useGetOrdersQueryMock.mockReset();
    useUpdateOrderMutationMock.mockReturnValue([
      vi.fn(),
      { isLoading: false, reset: vi.fn() },
    ] as never);
  });

  test("無訂單時渲染空狀態", () => {
    useGetOrdersQueryMock.mockReturnValue({
      data: { orders: [], totalOrders: 0, totalPages: 1 },
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      refetch: refreshMock,
    });

    renderOrdersTable();

    expect(screen.getByText(/尚無訂單資訊/)).toBeInTheDocument();
  });

  test("顯示 admin 可見部分", () => {
    useGetOrdersQueryMock.mockReturnValue({
      data: { orders: [baseOrder], totalOrders: 1, totalPages: 1 },
      error: null,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: refreshMock,
    });

    renderOrdersTable();

    expect(screen.getByText("ORD-1")).toBeInTheDocument();
    expect(screen.getByText("會員編號")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "出貨" })).toBeInTheDocument();
  });

  test("未支付的使用者訂單重定向至結帳", () => {
    const unpaidOrder: Order = {
      ...baseOrder,
      _id: "order-2",
      orderNo: "ORD-2",
      status: "processing" as Order["status"],
      paymentStatus: "unpaid" as Order["paymentStatus"],
    };

    useGetOrdersQueryMock.mockReturnValue({
      data: { orders: [unpaidOrder], totalOrders: 1, totalPages: 1 },
      error: null,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: refreshMock,
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
