import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";

import HeaderMenu from "@/components/organisms/HeaderMenu";

// 模擬 useCart 回傳 totalQuantity 為 3
vi.mock("@/hooks/useCart", () => ({
  useCart: () => ({ totalQuantity: 3 }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));

describe("HeaderMenu 元件", () => {
  const renderHeaderMenu = () => {
    return render(
      <MemoryRouter>
        <HeaderMenu />
      </MemoryRouter>
    );
  };

  test("點擊 menu 按鈕時打開和關閉 menu", () => {
    renderHeaderMenu();

    const menuBtn = screen.getByLabelText("開啟選單");
    expect(menuBtn).toBeInTheDocument();

    fireEvent.click(menuBtn);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByLabelText("關閉選單")).toBeInTheDocument();
  });

  test("顯示購物車及項目數量", () => {
    renderHeaderMenu();
    const cartBtn = screen.getByLabelText(/購物車目前有/);
    expect(cartBtn).toBeInTheDocument();
  });
});
