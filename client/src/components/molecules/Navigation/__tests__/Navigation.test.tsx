import Navigation from "@/components/molecules/Navigation";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

const handleClose = vi.fn();

describe("Navigation 元件", () => {
  test("為使用者渲染所有 Navigation 項目", () => {
    render(
      <MemoryRouter>
        <Navigation role="user" handleMenuClose={handleClose} />
      </MemoryRouter>
    );

    expect(screen.getByText("首頁")).toBeInTheDocument();
    expect(screen.getByText("關於我們")).toBeInTheDocument();
    expect(screen.getByText("最新消息")).toBeInTheDocument();
    expect(screen.getByText("常見問題")).toBeInTheDocument();
    expect(screen.getByText("聯繫我們")).toBeInTheDocument();
    expect(screen.getByText("會員中心")).toBeInTheDocument();
    expect(screen.queryByText("管理後台")).not.toBeInTheDocument(); // 管理後台不應該顯示
  });

  test("為 admin 渲染包括管理後台的 Navigation 項目", () => {
    render(
      <MemoryRouter>
        <Navigation role="admin" handleMenuClose={handleClose} />
      </MemoryRouter>
    );

    expect(screen.getByText("首頁")).toBeInTheDocument();
    expect(screen.getByText("關於我們")).toBeInTheDocument();
    expect(screen.getByText("最新消息")).toBeInTheDocument();
    expect(screen.getByText("常見問題")).toBeInTheDocument();
    expect(screen.getByText("聯繫我們")).toBeInTheDocument();
    expect(screen.getByText("會員中心")).toBeInTheDocument();
    expect(screen.getByText("管理後台")).toBeInTheDocument(); // 管理後台應該顯示
  });
});
