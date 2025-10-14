import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Navigation from "@/components/molecules/Navigation";

const handleClose = jest.fn();

test("renders all navigation items for users", () => {
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

test("renders admin navigation items for admins", () => {
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
