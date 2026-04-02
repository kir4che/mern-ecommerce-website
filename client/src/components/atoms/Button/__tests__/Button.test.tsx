import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Button from "@/components/atoms/Button";

const MockIcon = () => <svg data-testid="mock-svg" />;

describe("Button 元件", () => {
  test("渲染 secondary 按鈕並應用自定義樣式", () => {
    render(
      <Button variant="secondary" className="custom-class">
        Click Me
      </Button>
    );

    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toHaveClass("border-slate-900");
    expect(button).toHaveClass("custom-class");
  });

  test("渲染 icon 按鈕", () => {
    render(<Button variant="icon" icon={MockIcon} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("p-1");
    const svg = screen.getByTestId("mock-svg");
    expect(svg).toBeInTheDocument();
  });

  test("處理點擊事件", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /Click Me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
