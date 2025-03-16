import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/molecules/Pagination";

describe("Pagination Component", () => {
  const handlePageChange = jest.fn();

  test("renders page numbers correctly", () => {
    render(
      <Pagination
        page={1}
        totalPages={3}
        handlePageChange={handlePageChange}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("highlights the current page", () => {
    render(
      <Pagination
        page={1}
        totalPages={3}
        handlePageChange={handlePageChange}
      />,
    );

    const currentPageButton = screen.getByText("1");
    expect(currentPageButton).toHaveClass("bg-primary text-secondary");
  });

  test("calls handlePageChange when click next button", () => {
    render(
      <Pagination
        page={1}
        totalPages={3}
        handlePageChange={handlePageChange}
      />,
    );

    const nextBtn = screen.getByTestId("next-button");
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test("calls handlePageChange when click previous button", () => {
    render(
      <Pagination
        page={2}
        totalPages={3}
        handlePageChange={handlePageChange}
      />,
    );

    const previousBtn = screen.getByTestId("previous-button");
    fireEvent.click(previousBtn);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});
