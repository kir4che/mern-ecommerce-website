import { render, screen, fireEvent } from "@testing-library/react";

import Checkbox from "@/components/atoms/Checkbox";

const mockOnChange = jest.fn(); // 模擬 onChange 函式

test("renders checkbox with label", () => {
  render(
    <Checkbox
      id="test-checkbox"
      label="Test Checkbox"
      onChange={mockOnChange}
    />,
  );

  expect(screen.getByTestId("test-checkbox")).toBeInTheDocument(); // 確認 Checkbox 有渲染到畫面上
});

test("click checkbox", () => {
  render(
    <Checkbox
      id="test-checkbox"
      label="Test Checkbox"
      onChange={mockOnChange}
    />,
  );

  fireEvent.click(screen.getByTestId("test-checkbox"));
  expect(mockOnChange).toHaveBeenCalledTimes(1); // 確認 mockOnChange 被呼叫一次
});
