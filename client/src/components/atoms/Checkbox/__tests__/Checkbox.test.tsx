import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Checkbox from "@/components/atoms/Checkbox";

describe("Checkbox 元件", () => {
  test("渲染帶 label 的 checkbox", () => {
    render(
      <Checkbox id="test-checkbox" label="Test Label" onChange={vi.fn()} />
    );

    expect(screen.getByTestId("test-checkbox")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  test("點擊 checkbox 時呼叫 onChange", () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        id="test-checkbox"
        label="Test Checkbox"
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByTestId("test-checkbox");
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("當 disabled 為 true 時 disabled checkbox", () => {
    render(
      <Checkbox
        id="disabled-checkbox"
        label="Disabled Checkbox"
        disabled
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByTestId("disabled-checkbox");
    expect(checkbox).toBeDisabled();
  });

  test("接受 checked 以控制核取狀態", () => {
    const { rerender } = render(
      <Checkbox
        id="controlled-checkbox"
        label="Controlled"
        checked={false}
        onChange={vi.fn()}
      />
    );

    let checkbox = screen.getByTestId("controlled-checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(
      <Checkbox
        id="controlled-checkbox"
        label="Controlled"
        checked
        onChange={vi.fn()}
      />
    );

    checkbox = screen.getByTestId("controlled-checkbox");
    expect(checkbox).toBeChecked();
  });
});
