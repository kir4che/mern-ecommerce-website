import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import DropdownMenu from "@/components/atoms/DropdownMenu";

describe("DropdownMenu Component", () => {
  const mockList = [
    { label: "Item 1", value: "/item1" },
    { label: "Item 2", value: "/item2" },
  ];

  test("renders dropdown menu with title", () => {
    render(
      <MemoryRouter>
        <DropdownMenu title="Menu" list={mockList} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  test("renders dropdown menu items", () => {
    render(
      <MemoryRouter>
        <DropdownMenu title="Menu" list={mockList} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Item 1/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Item 2/i })).toBeInTheDocument();
  });
});
