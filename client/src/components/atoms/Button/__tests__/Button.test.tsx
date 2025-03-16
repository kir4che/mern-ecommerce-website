import { render, screen, fireEvent } from "@testing-library/react";

import Button from "@/components/atoms/Button";

const MockIcon = () => <svg data-testid="mock-svg" />;

describe("Button Component", () => {
  // primary button
  test("renders primary button with text", () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toBeInTheDocument(); // 確認 Button 有渲染到畫面上
    expect(button).toHaveClass("btn-outline");
  });

  // secondary button
  test("renders secondary button with custom class", () => {
    render(
      <Button variant="secondary" className="custom-class">
        Click Me
      </Button>,
    );

    const button = screen.getByRole("button", { name: /Click Me/i });
    expect(button).toHaveClass("btn-outline");
    expect(button).toHaveClass("custom-class");
    expect(button).toHaveClass("text-secondary");
  });

  // icon button
  test("renders icon button", () => {
    render(<Button variant="icon" icon={MockIcon} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn-icon");
    const svg = screen.getByTestId("mock-svg");
    expect(svg).toBeInTheDocument();
  });

  // handle click event
  test("handles click event", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole("button", { name: /Click Me/i });
    fireEvent.click(button); // 模擬點擊事件
    expect(handleClick).toHaveBeenCalledTimes(1); // 確認點擊事件被觸發了一次
  });
});
