import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import AdminGate from "@/components/organisms/AdminGate";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";

const mockNavigate = vi.fn();
const mockLocation = { pathname: "/admin" };

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

vi.mock("@/hooks/useAuth");
vi.mock("@/context/AlertContext");

const mockUseAuth = vi.mocked(useAuth);
const mockUseAlert = vi.mocked(useAlert);

describe("AdminGate 元件", () => {
  const mockShowAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockShowAlert.mockReset();
    mockUseAlert.mockReturnValue({
      alert: null,
      showAlert: mockShowAlert,
      hideAlert: vi.fn(),
    } satisfies ReturnType<typeof useAlert>);
  });

  test("useAuth 還在載入時顯示 loading 狀態", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    } satisfies ReturnType<typeof useAuth>);

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>
    );

    expect(screen.getByTestId("loading-container")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("沒登入的使用者重定向至登入頁面", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    } satisfies ReturnType<typeof useAuth>);

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>
    );

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/login", {
        replace: true,
        state: { from: mockLocation },
      })
    );
  });

  test("阻止非 admin 使用者進入 admin 頁面", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "user-1",
        email: "user@example.com",
        role: "user",
      },
      isLoading: false,
      isAuthenticated: true,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    } satisfies ReturnType<typeof useAuth>);

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>
    );

    // 確認 admin 內容沒有被顯示
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    expect(mockShowAlert).toHaveBeenCalledWith({
      variant: "error",
      message: "沒有權限進入此頁面！",
      dismissTimeout: 1500,
    });
  });

  test("為已登入的 admin 使用者渲染子元件", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "admin-1",
        email: "admin@example.com",
        role: "admin",
      },
      isLoading: false,
      isAuthenticated: true,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    } satisfies ReturnType<typeof useAuth>);

    render(
      <AdminGate>
        <div>Admin Content</div>
      </AdminGate>
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
