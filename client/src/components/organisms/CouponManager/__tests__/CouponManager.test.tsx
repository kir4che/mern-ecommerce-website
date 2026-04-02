import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeAll, beforeEach, vi } from "vitest";

import CouponManager from "@/components/organisms/CouponManager";
import { useAlert } from "@/context/AlertContext";
import {
  useCreateCouponMutation,
  useDeactivateCouponMutation,
  useUpdateCouponMutation,
} from "@/store/slices/apiSlice";

vi.mock("@/context/AlertContext");
vi.mock("@/store/slices/apiSlice");

const mockUseAlert = vi.mocked(useAlert);
const mockUseCreateCouponMutation = vi.mocked(useCreateCouponMutation);
const mockUseUpdateCouponMutation = vi.mocked(useUpdateCouponMutation);
const mockUseDeactivateCouponMutation = vi.mocked(useDeactivateCouponMutation);

// 產生一個假 coupon 物件
const makeCoupon = (overrides?: Partial<Record<string, unknown>>) => ({
  _id: (overrides?._id as string) ?? "coupon-1",
  code: (overrides?.code as string) ?? "SAVE10",
  discountType:
    (overrides?.discountType as "percentage" | "fixed") ?? "percentage",
  discountValue: (overrides?.discountValue as number) ?? 10,
  minPurchaseAmount: (overrides?.minPurchaseAmount as number) ?? 0,
  expiryDate: (overrides?.expiryDate as string) ?? "2099-12-31T00:00:00.000Z",
  isActive: (overrides?.isActive as boolean) ?? true,
  createdAt: (overrides?.createdAt as string) ?? "2026-01-01T00:00:00.000Z",
  updatedAt: (overrides?.updatedAt as string) ?? "2026-01-01T00:00:00.000Z",
});

describe("CouponManager 元件", () => {
  const showAlert = vi.fn();
  const createCoupon = vi.fn();
  const updateCoupon = vi.fn();
  const deactivateCoupon = vi.fn();

  beforeAll(() => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      writable: true,
      value: function showModal(this: HTMLDialogElement) {
        this.setAttribute("open", "");
      },
    });

    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      writable: true,
      value: function close(this: HTMLDialogElement) {
        this.removeAttribute("open");
      },
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAlert.mockReturnValue({
      alert: null,
      showAlert,
      hideAlert: vi.fn(),
    } satisfies ReturnType<typeof useAlert>);

    createCoupon.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ success: true }),
    });
    updateCoupon.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ success: true }),
    });
    deactivateCoupon.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ success: true }),
    });

    mockUseCreateCouponMutation.mockReturnValue([
      createCoupon,
      { isLoading: false, reset: vi.fn() },
    ] as never);
    mockUseUpdateCouponMutation.mockReturnValue([
      updateCoupon,
      { isLoading: false, reset: vi.fn() },
    ] as never);
    mockUseDeactivateCouponMutation.mockReturnValue([
      deactivateCoupon,
      { isLoading: false, reset: vi.fn() },
    ] as never);
  });

  const renderCouponManager = (coupons: ReturnType<typeof makeCoupon>[]) =>
    render(
      <MemoryRouter>
        <CouponManager coupons={coupons} />
      </MemoryRouter>
    );

  test("依搜尋關鍵字篩選優惠碼", () => {
    const coupons = [
      makeCoupon({ _id: "c1", code: "SAVE10" }),
      makeCoupon({ _id: "c2", code: "NEW20" }),
    ];

    renderCouponManager(coupons);

    expect(screen.getByText("SAVE10")).toBeInTheDocument();
    expect(screen.getByText("NEW20")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("搜尋名稱或標籤"), {
      target: { value: "save" },
    });

    expect(screen.getByText("SAVE10")).toBeInTheDocument();
    expect(screen.queryByText("NEW20")).not.toBeInTheDocument();
  });

  test("成功新增優惠碼", async () => {
    const { container } = renderCouponManager([]);

    fireEvent.click(screen.getByRole("button", { name: "新增" }));

    fireEvent.change(screen.getByPlaceholderText("ex. MARCH10"), {
      target: { value: "MARCH10" },
    });

    const numberInputs = container.querySelectorAll(
      'input[type="number"]'
    ) as NodeListOf<HTMLInputElement>;
    fireEvent.change(numberInputs[0], { target: { value: "15" } });

    const dateInput = container.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2027-05-10" } });

    const addButtons = screen.getAllByRole("button", { name: "新增" });
    fireEvent.click(addButtons[addButtons.length - 1]);

    // 等待非同步操作完成，確認 createCoupon 被呼叫。
    await waitFor(() => expect(createCoupon).toHaveBeenCalledTimes(1));

    // 驗證 createCoupon 被呼叫時的參數
    expect(createCoupon).toHaveBeenCalledWith({
      code: "MARCH10",
      discountType: "percentage",
      discountValue: 15,
      minPurchaseAmount: 0,
      expiryDate: "2027-05-10T00:00:00.000Z",
      isActive: true,
    });

    expect(showAlert).toHaveBeenCalledWith({
      variant: "success",
      message: "優惠碼已建立。",
    });
  });

  test("百分比折扣超過 100 時顯示驗證錯誤", async () => {
    const { container } = renderCouponManager([]);

    fireEvent.click(screen.getByRole("button", { name: "新增" }));

    fireEvent.change(screen.getByPlaceholderText("ex. MARCH10"), {
      target: { value: "bigdiscount" },
    });

    const numberInputs = container.querySelectorAll(
      'input[type="number"]'
    ) as NodeListOf<HTMLInputElement>;
    fireEvent.change(numberInputs[0], { target: { value: "120" } });

    const dateInput = container.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: "2027-05-10" } });

    const addButtons = screen.getAllByRole("button", { name: "新增" });
    fireEvent.click(addButtons[addButtons.length - 1]);

    await waitFor(() =>
      expect(showAlert).toHaveBeenCalledWith({
        variant: "error",
        message: "百分比折扣不可超過 100%。",
      })
    );

    expect(createCoupon).not.toHaveBeenCalled();
  });

  test("編輯模式時更新優惠碼", async () => {
    const coupons = [
      makeCoupon({
        _id: "coupon-1",
        code: "SAVE10",
        discountValue: 10,
      }),
    ];

    const { container } = renderCouponManager(coupons);

    fireEvent.click(screen.getByRole("button", { name: "編輯優惠碼" }));

    const numberInputs = container.querySelectorAll(
      'input[type="number"]'
    ) as NodeListOf<HTMLInputElement>;
    fireEvent.change(numberInputs[0], { target: { value: "25" } });

    fireEvent.click(screen.getByRole("button", { name: "更新" }));

    await waitFor(() => expect(updateCoupon).toHaveBeenCalledTimes(1));

    expect(updateCoupon).toHaveBeenCalledWith({
      id: "coupon-1",
      data: {
        code: "SAVE10",
        discountType: "percentage",
        discountValue: 25,
        minPurchaseAmount: 0,
        expiryDate: "2099-12-31T00:00:00.000Z",
        isActive: true,
      },
    });
  });

  test("刪除模式時刪除優惠碼", async () => {
    const coupons = [makeCoupon({ _id: "coupon-9", code: "DEL9" })];

    renderCouponManager(coupons);

    fireEvent.click(screen.getByRole("button", { name: "刪除優惠碼" }));
    await screen.findByText("確定要刪除「優惠碼 DEL9」嗎？");
    fireEvent.click(screen.getByRole("button", { name: "刪除" }));

    await waitFor(() =>
      expect(deactivateCoupon).toHaveBeenCalledWith("coupon-9")
    );

    expect(showAlert).toHaveBeenCalledWith({
      variant: "success",
      message: "已刪除優惠碼 DEL9",
    });
  });
});
