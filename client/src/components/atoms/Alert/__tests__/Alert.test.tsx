import { AlertProvider, useAlert } from "@/context/AlertContext";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

const TestAlertComponent = ({ autoDismiss, dismissTimeout = 1000 }) => {
  const { showAlert, hideAlert, alert } = useAlert();

  return (
    <>
      {alert && <p role="alert">{alert.message}</p>}
      <button
        onClick={() =>
          showAlert({
            variant: "info",
            message: "Info message.",
            autoDismiss,
            dismissTimeout,
          })
        }
      >
        Show Alert
      </button>
      {!autoDismiss && <button onClick={hideAlert}>Hide Alert</button>}
    </>
  );
};

describe("Alert 元件", () => {
  // 每個測試跑完後，清理 mock 資料。
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("顯示和隱藏 alert", async () => {
    render(
      <AlertProvider>
        <TestAlertComponent autoDismiss={false} />
      </AlertProvider>
    );

    // 點擊 Show Alert 按鈕，並確認 alert 有顯示。
    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByRole("alert")).toHaveTextContent("Info message.");

    // 點擊 Hide Alert 按鈕，並確認 alert 消失。
    fireEvent.click(screen.getByText("Hide Alert"));
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  test("auto dismiss alert", async () => {
    vi.useFakeTimers(); // 模擬計時器

    render(
      <AlertProvider>
        <TestAlertComponent autoDismiss={true} dismissTimeout={1000} />
      </AlertProvider>
    );

    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByRole("alert")).toHaveTextContent("Info message.");

    // 模擬 1 秒後，確認 alert 已經自動消失。
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByRole("alert")).toBeNull();

    vi.useRealTimers(); // 恢復計時器
  });
});
