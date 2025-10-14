import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmDeliveryForm from "@/components/organisms/ConfirmDeliveryForm";

const mockOrder = {
  orderNo: "12345678",
  name: "王小明",
  address: "台北市信義區",
  phone: "0912345678",
  orderItems: [
    {
      _id: "1",
      productId: "product1",
      quantity: 2,
      price: 100,
      amount: 200,
      title: "商品 A",
    },
    {
      _id: "2",
      productId: "product2",
      quantity: 1,
      price: 200,
      amount: 200,
      title: "商品 B",
    },
  ],
};

describe("ConfirmDeliveryForm", () => {
  const renderConfirmDeliveryForm = (
    setShippingTrackingNo: (value: string) => void = () => {}
  ) => {
    return render(
      <ConfirmDeliveryForm
        order={mockOrder}
        shippingTrackingNo=""
        setShippingTrackingNo={setShippingTrackingNo}
      />
    );
  };

  test("renders order details", () => {
    renderConfirmDeliveryForm();

    expect(screen.getByText("訂單編號：12345678")).toBeInTheDocument();
    expect(screen.getByText(/王小明/i)).toBeInTheDocument();
    expect(screen.getByText(/台北市信義區/i)).toBeInTheDocument();
    expect(screen.getByText(/0912345678/i)).toBeInTheDocument();
    expect(screen.getByText(/商品 A x 2/i)).toBeInTheDocument();
    expect(screen.getByText(/商品 B x 1/i)).toBeInTheDocument();
  });

  test("updates tracking number input", () => {
    const setShippingTrackingNo = jest.fn();
    renderConfirmDeliveryForm(setShippingTrackingNo);

    // 模擬輸入配送編號，並確認是否正確更新。
    fireEvent.change(screen.getByTestId("shippingTrackingNo"), {
      target: { value: "AB12345678" },
    });
    expect(setShippingTrackingNo).toHaveBeenCalledWith("AB12345678");
  });

  test("copies address to clipboard", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(), // 模擬複製功能
      },
    });

    renderConfirmDeliveryForm();

    // 點擊複製按鈕，並確認是否正確複製地址。
    fireEvent.click(screen.getAllByText("複製")[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("台北市信義區");
  });
});
