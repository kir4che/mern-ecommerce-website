import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import AppLayout from "@/layouts/AppLayout";
import { AlertProvider } from "@/context/AlertContext";
import { MemoryRouter } from "react-router";

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock("@/hooks/useCart", () => ({
  useCart: () => ({
    totalQuantity: 0,
  }),
}));

describe("AppLayout", () => {
  const renderAppLayout = () => {
    return render(
      <MemoryRouter>
        <AlertProvider>
          <AppLayout />
        </AlertProvider>
      </MemoryRouter>
    );
  };

  test("sets body overflow style based on menu state", async () => {
    renderAppLayout();
    expect(document.body.style.overflow).toBe("auto");

    const menuBtn = screen.getByLabelText("開啟選單");
    // 模擬 Menu 開啟，確認 overflow 有改變。
    fireEvent.click(menuBtn);
    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));

    // 模擬 Menu 關閉，確認 overflow 恢復。
    fireEvent.click(menuBtn);
    await waitFor(() => expect(document.body.style.overflow).toBe("auto"));
  });
});
