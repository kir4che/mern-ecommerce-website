import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AppLayout from "@/layouts/AppLayout";
import { AlertProvider } from "@/context/AlertContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { MemoryRouter } from "react-router";

describe("AppLayout", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AlertProvider>
          <AuthProvider>
            <CartProvider>
              <AppLayout>Test Children</AppLayout>
            </CartProvider>
          </AuthProvider>
        </AlertProvider>
      </MemoryRouter>,
    );
  });

  test("renders HeaderMenu, Alert, and Footer", () => {
    expect(screen.getByLabelText("menu-button")).toBeInTheDocument();
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });

  test("sets body overflow style based on menu state", async () => {
    expect(document.body.style.overflow).toBe("auto");

    const menuBtn = screen.getByLabelText("menu-button");
    // 模擬 Menu 開啟，確認 overflow 有改變。
    fireEvent.click(menuBtn);
    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));

    // 模擬 Menu 關閉，確認 overflow 恢復。
    fireEvent.click(menuBtn);
    await waitFor(() => expect(document.body.style.overflow).toBe("auto"));
  });
});
