import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { AlertProvider, useAlert } from "@/context/AlertContext";

// 模擬使用 Alert 的組件（不自動消失）
const TestAlert = () => {
  const { showAlert, hideAlert, alert } = useAlert();

  return (
    <>
      {alert && <p role="alert">{alert.message}</p>}
      <button
        onClick={() =>
          showAlert({
            variant: "info",
            message: "Info message.",
            autoDismiss: false,
          })
        }
      >
        Show Alert
      </button>
      <button onClick={hideAlert}>Hide Alert</button>
    </>
  );
};

// 模擬使用 Alert 的組件（自動消失）
const TestAutoDismissAlert = () => {
  const { showAlert, alert } = useAlert();

  return (
    <>
      {alert && <p role="alert">{alert.message}</p>}
      <button
        onClick={() =>
          showAlert({
            variant: "info",
            message: "Info message.",
            autoDismiss: true,
            dismissTimeout: 1000,
          })
        }
      >
        Show Alert
      </button>
    </>
  );
};

describe("Alert Component", () => {
  test("show and hide alert", async () => {
    render(
      <AlertProvider>
        <TestAlert />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText("Show Alert")); // 點擊 Show Alert 按鈕
    expect(screen.getByRole("alert")).toHaveTextContent("Info message."); // 確認 alert 出現

    fireEvent.click(screen.getByText("Hide Alert")); // 點擊 Hide Alert 按鈕
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull()); // 等待 alert 消失
  });

  test("auto dismiss alert", async () => {
    jest.useFakeTimers(); // 模擬計時器

    render(
      <AlertProvider>
        <TestAutoDismissAlert />
      </AlertProvider>,
    );

    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByRole("alert")).toHaveTextContent("Info message.");

    act(() => jest.advanceTimersByTime(1000)); // 前進 1000 ms
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());

    jest.useRealTimers(); // 恢復
  });
});
