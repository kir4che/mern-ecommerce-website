import Select from "@/components/atoms/Select";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

describe("Select 元件", () => {
  const mockList = [
    { label: "Item 1", value: "/item1" },
    { label: "Item 2", value: "/item2" },
  ];

  test("呼叫 onChange 並傳遞 name 和 value", () => {
    const handleChange = vi.fn();

    render(
      <MemoryRouter>
        <Select
          name="category"
          label="Menu"
          options={mockList}
          onChange={handleChange}
        />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Menu" }), {
      target: { value: "/item2" },
    });

    expect(handleChange).toHaveBeenCalledWith("category", "/item2");
  });
});
