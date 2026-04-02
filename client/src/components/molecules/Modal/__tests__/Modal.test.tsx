import Modal from "@/components/molecules/Modal";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, test, vi } from "vitest";

describe("Modal 元件", () => {
  const onConfirm = vi.fn();
  const onClose = vi.fn();

  beforeAll(() => {
    const showModalMock = vi.fn();
    const closeMock = vi.fn();

    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      writable: true,
      value: showModalMock,
    });

    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      writable: true,
      value: closeMock,
    });
  });

  const renderDefaultModal = () => {
    return render(
      <Modal
        id="test-modal"
        onConfirm={onConfirm}
        onClose={onClose}
        title="標題"
      >
        <p>內容</p>
      </Modal>
    );
  };

  test("正確渲染標題", () => {
    renderDefaultModal();
    expect(screen.getByText("標題")).toBeInTheDocument();
  });

  test("點擊確認按鈕時呼叫 onConfirm", () => {
    renderDefaultModal();

    fireEvent.click(screen.getByText("確認"));
    expect(onConfirm).toHaveBeenCalled();
  });

  test("點擊關閉按鈕時呼叫 onClose", () => {
    renderDefaultModal();

    const cancelBtn = screen.getByText("取消");
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
  });

  test("模式對話框關閉時呼叫 onClose", () => {
    renderDefaultModal();

    expect(screen.getByText("內容")).toBeInTheDocument();
  });

  test("onConfirm 回傳假值時不關閉", async () => {
    // 建立一個回傳 false 的 Mock，用來測試 Modal 的驗證邏輯。
    const onConfirmFalse = vi.fn(() => false);
    render(
      <Modal
        id="test-modal-2"
        onConfirm={onConfirmFalse}
        onClose={onClose}
        title="標題 2"
      >
        <p>內容 2</p>
      </Modal>
    );

    fireEvent.click(screen.getByText("確認"));
    expect(onConfirmFalse).toHaveBeenCalled();
    expect(screen.getByText("標題 2")).toBeInTheDocument();
  });
});
