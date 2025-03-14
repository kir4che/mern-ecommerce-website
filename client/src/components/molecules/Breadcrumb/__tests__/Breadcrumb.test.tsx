import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Breadcrumb from "@/components/molecules/Breadcrumb";

describe("Breadcrumb Component", () => {
  test("renders homepage link correctly", () => {
    render(
      <MemoryRouter>
        <Breadcrumb link="products" text="產品" />
      </MemoryRouter>,
    );

    expect(screen.getByText("首頁")).toBeInTheDocument();
  });

  test("renders correct link and text", () => {
    render(
      <MemoryRouter>
        <Breadcrumb link="products" text="產品" />
      </MemoryRouter>,
    );

    const productLink = screen.getByText("產品");
    expect(productLink).toBeInTheDocument();
    expect(productLink.closest("a")).toHaveAttribute("href", "/products");
  });
});
