import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

import ConfirmDeliveryForm from "@/components/organisms/ConfirmDeliveryForm";
import { useAlert } from "@/context/AlertContext";
import type { Order } from "@/types";

vi.mock("@/context/AlertContext");

const mockUseAlert = vi.mocked(useAlert);

const baseOrder: Partial<Order> = {
  orderNo: "ORD-1001",
  name: "kir4che",
  phone: "0912000000",
  address: "台北市",
  orderItems: [
    {
      _id: "item-1",
      productId: "product-1",
      quantity: 2,
      price: 100,
      amount: 200,
      title: "巧克力蛋糕",
    },
  ],
};

describe("ConfirmDeliveryForm 元件", () => {
  const showAlert = vi.fn();
  const setShippingTrackingNo = vi.fn();
  const setShippingCarrier = vi.fn();
  const writeText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAlert.mockReturnValue({
      alert: null,
      showAlert,
      hideAlert: vi.fn(),
    } satisfies ReturnType<typeof useAlert>);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  const renderForm = () =>
    render(
      <MemoryRouter>
        <ConfirmDeliveryForm
          order={baseOrder}
          shippingTrackingNo="TRACK-001"
          setShippingTrackingNo={setShippingTrackingNo}
          shippingCarrier="黑貓宅急便"
          setShippingCarrier={setShippingCarrier}
        />
      </MemoryRouter>
    );

  test("顯示訂單與收件資訊", () => {
    renderForm();

    expect(screen.getByText("ORD-1001")).toBeInTheDocument();
    expect(screen.getByText("巧克力蛋糕")).toBeInTheDocument();
    expect(screen.getByText(/收件人：kir4che/)).toBeInTheDocument();
    expect(screen.getByText(/聯絡電話：0912000000/)).toBeInTheDocument();
    expect(screen.getByDisplayValue("TRACK-001")).toBeInTheDocument();
  });

  test("可更新物流公司與配送單號", () => {
    renderForm();

    fireEvent.change(screen.getByLabelText("物流公司"), {
      target: { value: "新竹物流" },
    });
    fireEvent.change(screen.getByLabelText("配送單號"), {
      target: { value: "TRACK-999" },
    });

    expect(setShippingCarrier).toHaveBeenCalledWith("新竹物流");
    expect(setShippingTrackingNo).toHaveBeenCalledWith("TRACK-999");
  });

  test("點擊複製按鈕會複製內容並顯示成功 alert", () => {
    const { container } = renderForm();

    const copyButtons = container.querySelectorAll("button");
    fireEvent.click(copyButtons[0]);
    fireEvent.click(copyButtons[1]);

    expect(writeText).toHaveBeenCalledWith("ORD-1001");
    expect(writeText).toHaveBeenCalledWith("台北市");
    expect(showAlert).toHaveBeenCalledWith({
      variant: "success",
      message: "已複製訂單編號！",
    });
    expect(showAlert).toHaveBeenCalledWith({
      variant: "success",
      message: "已複製配送地址！",
    });
  });
});
