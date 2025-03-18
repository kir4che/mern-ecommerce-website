import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
import HeaderMenu from "@/components/organisms/HeaderMenu";

global.window.scrollTo = jest.fn();

// 模擬 useCart 回傳 totalQuantity 為 3
jest.mock("@/context/CartContext", () => ({
  useCart: () => ({ totalQuantity: 3 }),
}));

const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
};

jest.mock("@/context/AuthContext", () => ({
  ...jest.requireActual("@/context/AuthContext"),
  useAuth: () => mockAuthContext,
}));

describe("HeaderMenu Component", () => {
  // 測試開始前先重置 mock
  beforeEach(() => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
  });

  const renderHeaderMenu = (isMenuOpen: boolean, setIsMenuOpen: () => void) => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <HeaderMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </AuthProvider>
      </MemoryRouter>,
    );
  };

  test("changes header style when scrolled down and back to top", async () => {
    // 模擬設定內容高度 > 視窗高度
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
    });
    Object.defineProperty(window, "innerHeight", { value: 1000 });

    window.scrollTo = jest.fn();

    renderHeaderMenu(false, () => {});
    const header = screen.getByRole("banner");
    expect(header).not.toHaveClass("fixed");

    // 模擬頁面滾動
    await act(async () => {
      Object.defineProperty(window, "scrollY", { value: 20, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    // 確認滾動後有 fixed 樣式
    expect(header).toHaveClass("fixed");

    // 模擬滾動回頁面頂部
    await act(async () => {
      Object.defineProperty(window, "scrollY", { value: 0, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    // 確認滾動回頁面頂部後沒有 fixed 樣式
    expect(header).not.toHaveClass("fixed");

    act(() => {
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("scroll"));
    });
  });

  test("renders menu button and toggle menu on click", () => {
    const setIsMenuOpen = jest.fn();
    renderHeaderMenu(false, setIsMenuOpen);

    const menuBtn = screen.getByLabelText("開啟選單");
    expect(menuBtn).toBeInTheDocument();

    fireEvent.click(menuBtn);
    expect(setIsMenuOpen).toHaveBeenCalledWith(true);
  });

  test("shows navigation when menu is open", () => {
    renderHeaderMenu(true, () => {});
    // 確認 menu 打開後，navigation 顯示。
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("displays login and register buttons when user is not logged in", () => {
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
    renderHeaderMenu(false, () => {});

    expect(screen.getByText("登入")).toBeInTheDocument();
    expect(screen.getByText("註冊")).toBeInTheDocument();
  });

  test("displays user icon and admin dashboard link when logged in", () => {
    mockAuthContext.user = { role: "admin" };
    mockAuthContext.isAuthenticated = true;

    renderHeaderMenu(false, () => {});

    expect(screen.queryByText("登入")).not.toBeInTheDocument();
    expect(screen.queryByText("註冊")).not.toBeInTheDocument();

    expect(screen.getByLabelText("會員中心")).toBeInTheDocument();
    expect(screen.getByLabelText("管理後台")).toBeInTheDocument();
  });

  test("shows cart quantity", () => {
    renderHeaderMenu(false, () => {});
    expect(screen.getByLabelText("購物車數量")).toHaveTextContent("3");
  });
});
