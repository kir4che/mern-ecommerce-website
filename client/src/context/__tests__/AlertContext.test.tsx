import { AlertProvider, useAlert } from "@/context/AlertContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

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
      </AlertProvider>
    );
  };

  test("呼叫 showAlert 時顯示 Alert", () => {
    renderTestComponent();
    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByTestId("alert")).toHaveTextContent("Test Alert");
  });

  test("呼叫 hideAlert 時隱藏 Alert", () => {
    renderTestComponent();
    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByTestId("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Alert"));
    expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
  });

  test("顯示 info 類型的 Alert", () => {
    renderTestComponent();
    fireEvent.click(screen.getByText("Show Alert"));
    expect(screen.getByTestId("alert")).toHaveAttribute("data-variant", "info");
  });

  test("顯示 success 類型的 Alert", () => {
    renderTestComponent();
    fireEvent.click(screen.getByText("Show Success"));
    expect(screen.getByTestId("alert")).toHaveAttribute(
      "data-variant",
      "success"
    );
  });

  test("顯示 error 類型的 Alert", () => {
    renderTestComponent();
    fireEvent.click(screen.getByText("Show Error"));
    expect(screen.getByTestId("alert")).toHaveAttribute(
      "data-variant",
      "error"
    );
  });
});
