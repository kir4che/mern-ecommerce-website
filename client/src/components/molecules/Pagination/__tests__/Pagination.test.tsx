import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Pagination from "@/components/molecules/Pagination";

describe("Pagination 元件", () => {
  const handlePageChange = vi.fn();
  beforeEach(() => handlePageChange.mockClear());

  const renderPagination = (page: number, totalPages: number) => {
    return render(
      <Pagination
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    );
  };

  test("正確渲染頁碼", () => {
    renderPagination(1, 3);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("Highlight 當前頁面", () => {
    renderPagination(1, 3);
    const pageButton = screen.getByRole("button", {
      name: /前往第 1 頁/i,
    });
    expect(pageButton).toBeInTheDocument();
  });

  test("點擊下一頁按鈕時呼叫 handlePageChange", () => {
    renderPagination(1, 3);

    fireEvent.click(screen.getByRole("button", { name: /前往下一頁/i }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test("點擊上一頁按鈕時呼叫 handlePageChange", () => {
    renderPagination(2, 3);

    fireEvent.click(screen.getByRole("button", { name: /返回上一頁/i }));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  test("最後一頁時下一頁按鈕 disabled", () => {
    renderPagination(3, 3);
    const nextButton = screen.getByRole("button", { name: /前往下一頁/i });
    expect(nextButton).toBeDisabled();
  });

  test("第一頁時上一頁按鈕 disabled", () => {
    renderPagination(1, 3);
    const prevButton = screen.getByRole("button", { name: /返回上一頁/i });
    expect(prevButton).toBeDisabled();
  });
});
