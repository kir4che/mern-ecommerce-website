import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/molecules/Pagination";

describe("Pagination Component", () => {
  const handlePageChange = jest.fn();
  beforeEach(() => handlePageChange.mockClear());

  const renderPagination = (page: number, totalPages: number) => {
    return render(
      <Pagination
        page={page}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />,
    );
  };

  test("renders page numbers correctly", () => {
    renderPagination(1, 3);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("highlights the current page", () => {
    renderPagination(1, 3);
    expect(screen.getByText("1")).toHaveClass("bg-primary text-secondary");
  });

  test("calls handlePageChange when click next button", () => {
    renderPagination(1, 3);

    fireEvent.click(screen.getByTestId("next-button"));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test("calls handlePageChange when click previous button", () => {
    renderPagination(2, 3);

    fireEvent.click(screen.getByTestId("previous-button"));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  test("next button should not be visible on last page", () => {
    renderPagination(3, 3);
    expect(screen.queryByTestId("next-button")).not.toBeInTheDocument();
  });

  test("previous button should not be visible on first page", () => {
    renderPagination(1, 3);
    expect(screen.queryByTestId("previous-button")).not.toBeInTheDocument();
  });
});
