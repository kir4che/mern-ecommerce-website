import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Input from "@/components/atoms/Input";

describe("Input 元件", () => {
  test("接受 input 值", () => {
    render(
      <Input id="test-input" label="Test Input" placeholder="Enter text" />
    );

    const input = screen.getByPlaceholderText("Enter text");
    fireEvent.change(input, { target: { value: "Test" } });
    expect(input).toHaveValue("Test");
  });

  test("當必填欄位為空時顯示錯誤訊息", () => {
    render(
      <Input
        id="test-input"
        label="Test Required Input"
        error="This field is required"
        required
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  test("使用者輸入有效值時移除錯誤訊息", () => {
    const { rerender } = render(
      <Input id="test-input" label="Test Input" error="Error" required />
    );

    expect(screen.getByText("Error")).toBeInTheDocument();

    rerender(<Input id="test-input" label="Test Input" required />);
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  test("根據類型驗證輸入", () => {
    render(<Input id="test-input" label="Test Input" type="number" />);

    const input = screen.getByLabelText("Test Input");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue(null);

    fireEvent.change(input, { target: { value: "123" } });
    expect(input).toHaveValue(123);
  });

  test("輸入變化時呼叫 onChange", () => {
    const handleChange = vi.fn();
    render(
      <Input id="test-input" label="Test Input" onChange={handleChange} />
    );

    fireEvent.change(screen.getByLabelText("Test Input"), {
      target: { value: "Hello" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
