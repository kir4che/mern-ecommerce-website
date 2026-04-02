import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { AuthHookReturn } from "@/hooks/useAuth";
import { useAuth } from "@/hooks/useAuth";
import PrivateRoute from "@/routes/PrivateRoute";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const MockComponent = () => <div>受保護的內容</div>;

describe("PrivateRoute", () => {
  beforeEach(() => vi.clearAllMocks());

  test("使用者沒登入時重定向至登入", () => {
    // 建立一個沒登入的使用者狀態
    const authState: AuthHookReturn = {
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    };
    vi.mocked(useAuth).mockReturnValue(authState);

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <MockComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test("使用者登入時顯示受保護內容", () => {
    const authState: AuthHookReturn = {
      user: { id: "123", email: "test@example.com", role: "user" },
      isLoading: false,
      error: null,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    };
    vi.mocked(useAuth).mockReturnValue(authState);

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <MockComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("受保護的內容")).toBeInTheDocument();
  });
});
