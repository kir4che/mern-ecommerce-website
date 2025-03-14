import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import userEvent from "@testing-library/user-event";

const mockRefresh = jest.fn();
jest.mock("@/hooks/useAxios", () => ({
  useAxios: () => ({ refresh: mockRefresh }),
}));

const AuthConsumer = () => {
  const { login, logout, user, isAuthenticated, error } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </p>
      <p data-testid="user-email">{user?.email || "No User"}</p>
      <p data-testid="auth-error">{error || "No Error"}</p>
      <button
        onClick={() => login("test@example.com", "password", true)}
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    mockRefresh.mockClear(); // 清除 mock 記錄
    localStorage.clear(); // 清除 localStorage
  });

  test("login successfully", async () => {
    const user = userEvent.setup();

    // 模擬 API 回傳成功的登入狀態
    mockRefresh.mockResolvedValueOnce({
      success: true,
      user: { id: "1", email: "test@example.com", role: "user" },
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "Not Authenticated",
    );

    // 點擊登入按鈕，等待狀態更新，確認登入成功。
    await user.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Authenticated",
      );
      expect(screen.getByTestId("user-email")).toHaveTextContent(
        "test@example.com",
      );
      expect(screen.getByTestId("auth-error")).toHaveTextContent("No Error");
    });
  });

  test("login failed", async () => {
    const user = userEvent.setup();

    // 模擬 API 回應失敗
    mockRefresh.mockResolvedValueOnce({
      success: false,
      message: "Invalid credentials",
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "Not Authenticated",
    );

    // 點擊登入按鈕，等待狀態更新，確認錯誤訊息是否正確顯示。
    await user.click(screen.getByTestId("login-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-error")).toHaveTextContent(
        "Invalid credentials",
      );
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Not Authenticated",
      );
      expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
    });
  });

  test("logout successfully", async () => {
    const user = userEvent.setup();

    mockRefresh.mockResolvedValueOnce({
      success: true,
      user: { id: "1", email: "test@example.com", role: "user" },
    });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByTestId("login-btn"));
    await waitFor(() =>
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Authenticated",
      ),
    );

    // 模擬成功登出
    mockRefresh.mockResolvedValueOnce({ success: true });

    // 點擊登出按鈕，等待狀態更新，確認登出成功。
    await user.click(screen.getByTestId("logout-btn"));
    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "Not Authenticated",
      );
      expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
    });
  });
});
