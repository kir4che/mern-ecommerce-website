import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/molecules/Modal";

global.HTMLDialogElement.prototype.showModal = jest.fn();
global.HTMLDialogElement.prototype.close = jest.fn();

describe("Modal Component", () => {
  const onConfirm = jest.fn();
  const onClose = jest.fn();

  beforeAll(() => {
    global.HTMLDialogElement.prototype.showModal = jest.fn();
    global.HTMLDialogElement.prototype.close = jest.fn();
  });

  beforeEach(() => {
    render(
      <Modal
        id="test-modal"
        onConfirm={onConfirm}
        onClose={onClose}
        title="Test Title"
      >
        <p>This is the modal content</p>
      </Modal>,
    );
  });

  test("renders the title correctly", () => {
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  test("calls onConfirm when click confirm button", () => {
    const confirmBtn = screen.getByText("確認");
    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalled();
  });

  test("calls onClose when click close button", () => {
    const closeBtn = screen.getByText("取消");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
