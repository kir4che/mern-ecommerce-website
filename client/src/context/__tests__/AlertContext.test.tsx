import { render, screen, fireEvent, act } from "@testing-library/react";
import { AlertProvider, useAlert } from "@/context/AlertContext";

const TestComponent = () => {
  const { alert, showAlert, hideAlert } = useAlert();

  return (
    <div>
      <button
        onClick={() => showAlert({ variant: "info", message: "Test Alert" })}
      >
        Show Alert
      </button>
      <button
        onClick={() =>
          showAlert({ variant: "success", message: "Success Alert" })
        }
      >
        Show Success
      </button>
      <button
        onClick={() => showAlert({ variant: "error", message: "Error Alert" })}
      >
        Show Error
      </button>
      <button
        onClick={() =>
          showAlert({
            variant: "info",
            message: "No Auto Dismiss",
            autoDismiss: false,
          })
        }
      >
        No Auto Dismiss
      </button>
      <button
        onClick={() =>
          showAlert({
            variant: "info",
            message: "Custom Timeout",
            dismissTimeout: 1000,
          })
        }
      >
        Custom Timeout
      </button>
      <button
        onClick={() =>
          showAlert({
            variant: "info",
            message: "Non-floating Alert",
            floating: false,
          })
        }
      >
        Non-floating Alert
      </button>
      <button onClick={hideAlert}>Hide Alert</button>
      {alert && (
        <div
          data-testid="alert"
          data-variant={alert.variant}
          data-floating={alert.floating}
        >
          {alert.message}
        </div>
      )}
    </div>
  );
};

describe("AlertContext", () => {
  const renderTestComponent = () => {
    return render(
      <AlertProvider>
        <TestComponent />
      </AlertProvider>,
    );
  };

  beforeEach(() => jest.useFakeTimers());
  // 每次測試完清除計時器
  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
  });

  test("AlertContext works correctly", async () => {
    renderTestComponent();
    // 點擊 "Show Alert" 按鈕，確認 alert 有顯示。
    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByTestId("alert")).toHaveTextContent("Test Alert");

    // 點擊 "Hide Alert" 按鈕，確認 alert 已隱藏。
    fireEvent.click(screen.getByText("Hide Alert"));
    expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
  });

  test("alert message automatically disappears", async () => {
    renderTestComponent();
    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByTestId("alert")).toHaveTextContent("Test Alert");

    // 模擬 3000ms 過後，確認 alert 應該自動消失。
    act(() => jest.advanceTimersByTime(3000));
    expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
  });

  test("alert message can be set to not auto-dismiss", async () => {
    renderTestComponent();

    // 設定 alert 不自動消失
    fireEvent.click(screen.getByText("No Auto Dismiss"));
    expect(screen.getByTestId("alert")).toHaveTextContent("No Auto Dismiss");

    // 模擬 3000ms 過後，確認 alert 仍然顯示。
    act(() => jest.advanceTimersByTime(3000));
    expect(screen.getByTestId("alert")).toHaveTextContent("No Auto Dismiss");
  });

  test("supports different types of alert messages", async () => {
    renderTestComponent();

    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByTestId("alert")).toHaveAttribute("data-variant", "info");

    fireEvent.click(screen.getByText("Hide Alert"));

    fireEvent.click(screen.getByText("Show Success"));
    expect(screen.getByTestId("alert")).toHaveAttribute(
      "data-variant",
      "success",
    );

    fireEvent.click(screen.getByText("Hide Alert"));

    fireEvent.click(screen.getByText("Show Error"));
    expect(screen.getByTestId("alert")).toHaveAttribute(
      "data-variant",
      "error",
    );
  });
});
