import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/molecules/Modal";

describe("Modal Component", () => {
  const onConfirm = jest.fn();
  const onClose = jest.fn();

  beforeAll(() => {
    const showModalMock = jest.fn();
    const closeMock = jest.fn();

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
        title="Test Title"
      >
        <p>This is the modal content</p>
      </Modal>
    );
  };

  test("renders the title correctly", () => {
    renderDefaultModal();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  test("calls onConfirm when click confirm button", () => {
    renderDefaultModal();

    fireEvent.click(screen.getByText("確認"));
    expect(onConfirm).toHaveBeenCalled();
  });

  test("calls onClose when click close button", () => {
    renderDefaultModal();

    fireEvent.click(screen.getByText("取消"));
    expect(onClose).toHaveBeenCalled();
  });

  test("calls onClose when modal is closed", () => {
    renderDefaultModal();

    fireEvent.click(screen.getByText("取消"));
    expect(onClose).toHaveBeenCalled();
  });

  test("not close when onConfirm returns false", async () => {
    const onConfirmFalse = jest.fn(() => false);
    render(
      <Modal
        id="test-modal-2"
        onConfirm={onConfirmFalse}
        onClose={onClose}
        title="Test Title 2"
      >
        <p>This is the modal content</p>
      </Modal>
    );

    fireEvent.click(screen.getByText("確認"));
    expect(onConfirmFalse).toHaveBeenCalled();
    expect(screen.getByText("Test Title 2")).toBeInTheDocument();
  });
});
